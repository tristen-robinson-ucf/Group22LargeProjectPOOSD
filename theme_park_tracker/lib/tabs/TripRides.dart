import 'dart:convert';
import 'dart:async';
import 'dart:developer';

import 'package:dio/dio.dart';

import 'package:flutter/cupertino.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:hexcolor/hexcolor.dart';
import 'package:http/http.dart' as http;
import 'package:fluttertoast/fluttertoast.dart';
import 'package:theme_park_tracker/main.dart';
import 'package:theme_park_tracker/tabs/SavedParks.dart';
import 'package:dropdown_search/dropdown_search.dart';
import 'package:theme_park_tracker/tabs/PlannedTrips.dart';

class TripRides extends StatefulWidget{
  int id;
  int parkId;
  List<dynamic> rides;
  int tripId;
  String firstname, lastname;
  List<int> parkArr;

  TripRides({super.key, required this.parkId, required this.id, required this.tripId, required this.rides, required this.firstname, required this.lastname, required this.parkArr});

  @override
  State<TripRides> createState() => _TripRides();
}

class _TripRides extends State<TripRides>{
  late int id;
  late int parkId;
  late int tripId;
  late String parkName;
  late List<dynamic> rides;
  late String firstname, lastname;
  late List<int> parkArr;
  int currDayTime = 0;


  String selectedRide = '';
  Map<String, List<int>> rideWaits = {};
  Map<int, int> avgWaits = {};
  List<String> dropdownNames=[];
  Map<String, int> rideIdName = {};
  List<int> plannedRides = [];
  late String currAvg;
  List<int> savedRidesAvgWaits = [];
  List<String> savedRidesAvgWaitsString = [];



  @override
  void initState(){
    super.initState();
    id = widget.id;
    parkId = widget.parkId;
    tripId = widget.tripId;
    rides = widget.rides;
    firstname = widget.firstname;
    lastname = widget.lastname;
    parkArr = widget.parkArr;
    getRideNums();
    getData();
    getAvgs();
    calculateTime();

  }

  void getRideNums(){
    for (dynamic val in rides){

      plannedRides.add(int.parse(val.toString()));
    }
  }



  void getData() async{
    try{
      var response = await Dio().get('https://queue-times.com/parks/$parkId/queue_times.json');
      if (response.statusCode == 200){
        setState(() async {
          Map<String, dynamic> json = jsonDecode(response.toString());
          List<Land> lands = (json['lands'] as List).map((landJson) {
            return Land(
              id: landJson['id'],
              name: landJson['name'],
              rides: (landJson['rides'] as List).map((rideJson) {
                return Ride(
                  id: rideJson['id'],
                  name: rideJson['name'],
                  isOpen: rideJson['is_open'],
                  waitTime: rideJson['wait_time'],
                  lastUpdated: DateTime.parse(rideJson['last_updated']),
                );
              }).toList(),
            );
          }).toList();

          List<dynamic> rides = json['rides'];

          Root root = Root(
            lands: lands,
            rides: rides.cast(),
          );


          // add the name and the wait time into
          for (Land land in lands){
            for (Ride ride in land.rides){
              List<int> curr = [];
              if (ride.isOpen == false){
                curr.add(-1);
              }
              else {
                curr.add(ride.waitTime);
              }
              dropdownNames.add(ride.name);

              // add the id to the list as well to match it with average waits
              curr.add(ride.id);
              // getAvgData(ride.id);
              // curr.add(avgWaits[ride.id]!);
              // print(curr);
              rideWaits.putIfAbsent(ride.name, () => curr);

              for (int i in plannedRides){
                if (i == ride.id){
                  rideIdName[ride.name] = ride.id;
                }
              }

              try{
                var rideNum = ride.id;
                var response2 = await Dio().get(
                    'https://queue-times.com/en-US/parks/$parkId/rides/$rideNum/average_histogram.json');
                if (response2.statusCode == 200){
                  setState(() {
                    String respString2 = response2.toString();

                    // parse the string into map , dynamic to be able to handle it
                    Map<String, dynamic> jsonMap = jsonDecode(respString2);

                    // map the string dynamics into new entries of string and double
                    // this way we have a string with range of values and the double reflecting their occurence rate on the histogram
                    Map<String, double> avgMap = jsonMap.map((key, value) {
                      return MapEntry(key, value.toDouble());
                    });

                    double max = 0;
                    String maxKey = "";

                    avgMap.forEach((key, value) {
                      if (value > max) {
                        max = value;
                        maxKey = key;
                      }
                    });

                    // only do splits if wait exists
                    if (avgMap.length > 0) {
                      // split by the - to get second number and then remove whitespace after
                      List<String> split = maxKey.split("-");
                      List<String> nextSplit = split[1].split(" ");
                      avgWaits.putIfAbsent(rideNum, () => int.parse(nextSplit[0]));
                    } else{
                      avgWaits.putIfAbsent(rideNum, () => 0);
                    }
                  });
                } else{
                  print(response.statusCode);
                }
              } catch(e){
                print(e);
              }
            }
          }
        });
      } else{
        print(response.statusCode);
      }
    } catch(e){
      print(e);
    }
  }

  void getAvgs(){
    for (int i in plannedRides){
      avgWaits.forEach((key, value) {
        if (key == i){
          savedRidesAvgWaits.add(value);
          savedRidesAvgWaitsString.add(value.toString());
        }
      });
    }
  }

  int calculateTime(){
    int time = 0;
    avgWaits.forEach((key, value) {
      if (plannedRides.contains(key)){

        setState(() {
          time += value;
        });

      }
    });
    return time;

  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        title: Text("Edit your trip"),
        titleTextStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Colors.white),
        automaticallyImplyLeading: false,
        backgroundColor: View.of(context).platformDispatcher.platformBrightness == Brightness.dark ? (Colors.grey.shade800): HexColor("Eb5756"),
        leading: IconButton(
          onPressed: (){
            Navigator.push((context), MaterialPageRoute(builder: (context) => LandingPage(id: id, parkArr: parkArr, firstname: firstname, lastname: lastname)));
          },
          icon: const Icon(Icons.arrow_back),
          color: Colors.white,
        ),

      ),
      body:  Padding(
        padding: EdgeInsets.all(8.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [


            Container(
              height: 100,
              width: double.infinity,
              child: Center(
                child: Text("Current Time: ${calculateTime().toString()} minutes", style: TextStyle(fontSize: 25, color: Theme.of(context).colorScheme.tertiary)),
              ),
            ),


            Expanded(
              flex: 1,
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text("Current rides planned for the day.", style: TextStyle(fontSize: 15, color: Theme.of(context).colorScheme.tertiary)),

                      // create a container to hold all the current rides, it is going to be a scrollable sub-section of the page to allow space for adding more rides at the bottom of the page
                      Container(
                        height: 350,

                          padding: const EdgeInsets.all(15),
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.vertical(top: Radius.circular(30.0), bottom: Radius.circular(30.0), ),
                            color: View.of(context).platformDispatcher.platformBrightness == Brightness.dark ? (Theme.of(context).colorScheme.secondary) : Colors.grey.shade100,
                            boxShadow: [
                              BoxShadow(

                                offset: Offset(0.0, 1.0),
                                blurRadius: 5,
                              )
                            ],
                          ),

                        child: Container(
                          padding: const EdgeInsets.all(6),
                          child:
                          ListView.builder(
                            itemCount: rideIdName.length,
                            shrinkWrap: true,
                            itemBuilder: (context, index) => Card(
                              color: View.of(context).platformDispatcher.platformBrightness == Brightness.dark ? (Colors.grey.shade500): HexColor("Eb5756"),
                              elevation: 2,
                              margin: const EdgeInsets.symmetric(vertical: 8.0),
                              child: SingleChildScrollView(
                                child: Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Expanded(
                                    flex: 7,
                                    child:  Container(
                                      padding: const EdgeInsets.all(7),
                                      child: Text(rideIdName.keys.elementAt(index), overflow: TextOverflow.ellipsis, style: TextStyle(fontSize: 17, color: Colors.white)),
                                    ),
                                  ),
                                  Padding(
                                    padding: EdgeInsets.all(4.0),
                                    child:
                                    (avgWaits[rideIdName.values.elementAt(index)] == null) ? Center() :
                                    Column(
                                        children: [
                                          Text("Average", style: TextStyle(color: Colors.white)),
                                          Container(
                                              height: 30,
                                              width: 30,
                                              color: Colors.white,
                                              child: Column(
                                                mainAxisAlignment: MainAxisAlignment.center,
                                                crossAxisAlignment: CrossAxisAlignment.center,
                                                children: [Text(avgWaits[rideIdName.values.elementAt(index)].toString() , style: TextStyle(color: Colors.black, fontSize: 17), textAlign: TextAlign.center)],
                                              )
                                          )
                                        ]
                                    ),
                                  ),
                                  // this is the button to remove a ride from the current trip plan
                                  Padding(
                                    padding: EdgeInsets.all(8.0),
                                    child: IconButton(
                                      iconSize: 30,
                                      color: Colors.white,
                                      icon: const Icon(
                                        Icons.remove,
                                      ),
                                      onPressed: () {
                                        removeRide(rideIdName.values.elementAt(index), tripId);
                                        for (dynamic it in rides){
                                          if (int.parse(it.toString()) == rideIdName.values.elementAt(index)){
                                            rides.remove(it);
                                            break;
                                          }
                                        }
                                        calculateTime();
                                        Navigator.push(context, MaterialPageRoute(builder: (context) => TripRides(parkId: parkId, id: id, tripId: tripId, rides: rides, firstname: firstname, lastname: lastname, parkArr: parkArr)));
                                      },
                                    ),
                                  )
                                ],
                              ),
                              ),
                            ),
                          ),
                        ),
                      ),
                    ],
                ),
            ),
            SizedBox(height: 20),
            // add functionality to add more rides to the current plan
            DropdownSearch<dynamic>(
              items: dropdownNames,
              popupProps: const PopupProps.menu(
                showSearchBox: true,
              ),
              dropdownButtonProps: DropdownButtonProps(color: Colors.blue),
              dropdownDecoratorProps: DropDownDecoratorProps(
                textAlignVertical: TextAlignVertical.center,
                dropdownSearchDecoration: InputDecoration(
                  labelText: 'Choose a ride to add',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(50),
                  ),
                ),
              ),
              onChanged: (value) {
                setState(() {
                  selectedRide = value.toString();
                  rideWaits.forEach((key, value) {
                    if (key == selectedRide){
                      rides.add(value[1]);
                      addRide(value[1], tripId);
                    }
                  });
                  calculateTime();

                  Navigator.push(context, MaterialPageRoute(builder: (context) => TripRides(parkId: parkId, id: id, tripId: tripId, rides: rides, firstname: firstname, lastname: lastname, parkArr: parkArr)));

                });
              },

              selectedItem: selectedRide,

            ),
          ],
        ),
      ),
    );
  }

  // endpoint to remove a ride from a trips plan
  void removeRide(int rideId, int tripId) async {
    final response = await http.post(
        Uri.parse('https://group-22-0b4387ea5ed6.herokuapp.com/api/deleteRide'),
        headers: <String, String>{
          'Content-Type': 'application/json',
        },
        body: jsonEncode(<String, int>{
          'tripID' : tripId,
          'rideID' : rideId,
        })
    );
    if (response.statusCode == 200){
      Fluttertoast.showToast(msg: "Removed ride");
    }
    else {
      Fluttertoast.showToast(msg: response.statusCode.toString());
    }

  }

  // endpoint to add a ride to a trip
  void addRide(int rideId, int tripId) async {
    final response = await http.post(
        Uri.parse('https://group-22-0b4387ea5ed6.herokuapp.com/api/addRide'),
        headers: <String, String>{
          'Content-Type': 'application/json',
        },
        body: jsonEncode(<String, int>{
          'tripID' : tripId,
          'rideID' : rideId,
        })
    );
    if (response.statusCode == 200){
      Fluttertoast.showToast(msg: "Added ride");
    }
    else {
      Fluttertoast.showToast(msg: response.statusCode.toString());
    }
  }
}

