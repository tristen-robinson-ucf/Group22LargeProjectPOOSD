import 'dart:convert';
import 'dart:async';

import 'package:dio/dio.dart';

import 'package:flutter/cupertino.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter/widgets.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:theme_park_tracker/tabs/SavedParks.dart';
import 'package:dropdown_search/dropdown_search.dart';

class PlannedTrips extends StatefulWidget{
  int id;
  PlannedTrips({super.key, required this.id});

  @override
  State<PlannedTrips> createState() => _PlannedTrips();
}


class _PlannedTrips extends State<PlannedTrips>{
  int id = 0;
  List<Trips> trips = [];


  @override
  void initState() {
    super.initState();
    id = widget.id;
    getData();
  }

  void getData() async{
    try{
      var response = await Dio().post(
        'https://group-22-0b4387ea5ed6.herokuapp.com/api/searchTrip',
      options: Options(headers: {
        'Content-Type': 'application/json',
      }),
        data: {
          'userId': id,
          'search': '',
        },
      );
      if (response.statusCode == 200){
        print(response.data);
      }
    } catch(e){
      print(e);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: Padding(
          padding: EdgeInsets.all(8.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Expanded(
                  flex: 1,
                  child: ListView.builder(
                      itemCount: 1,
                      itemBuilder: (context, index){

                      })),
              MaterialButton(onPressed: () {
                Navigator.push(context, MaterialPageRoute(builder: (context) => MakeTrip(id: id)));
              },
                color: Colors.lightBlue,
                child: Text('Make a new trip', style: TextStyle(color: Colors.black) ),

              )
            ],
          ),
        )
    );
  }

}

class MakeTrip extends StatefulWidget{
  int id;
  MakeTrip({super.key, required this.id});

  @override
  State<MakeTrip> createState() => _MakeTrip();
}

class _MakeTrip extends State<MakeTrip>{
  late int id;
  late DateTime date;
  late int parkId;
  late List<int> rides;
  Map<String, int> parkList = {};
  List<String> parkNames = [];
  var allParks;
  String selectedPark = '';

  TextEditingController _dateController = TextEditingController();
  TextEditingController _parkController = TextEditingController();

  @override
  void initState(){
    super.initState();
    id = widget.id;
    getParkData();
  }


  void getParkData() async{
    try{
      var response = await Dio().get('https://queue-times.com/parks.json');
      if (response.statusCode == 200){
        setState(() {
          allParks = response.data as List;
          for (int i = 0; i < allParks.length; i++){
            for (int j = 0; j < allParks[i]['parks'].length; j++){
              parkList.putIfAbsent(allParks[i]['parks'][j]['name'], () => allParks[i]['parks'][j]['id']);
              parkNames.add(allParks[i]['parks'][j]['name']);
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


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar:  AppBar(
        centerTitle: true,
        title: Text("Make a trip"),
        titleTextStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Colors.white),
      ),
      body: Column(
        children: [
          Padding(
            padding: EdgeInsets.all(30),
            child: TextField(
              controller: _dateController,
              decoration: const InputDecoration(
                labelText: 'Date of trip',
                filled: true,
                prefixIcon: Icon(Icons.calendar_today),
                enabledBorder: OutlineInputBorder(
                  borderSide: BorderSide.none),
                focusedBorder: OutlineInputBorder(
                  borderSide: BorderSide(color: Colors.blue),
                ),
              ),
              readOnly: true,
              onTap: (){
                _selectDate();
              },
            ),
          ),
          DropdownSearch<dynamic>(
            items: parkNames,
            popupProps: PopupProps.menu(
              showSearchBox: true,
            ),
            dropdownButtonProps: DropdownButtonProps(color: Colors.blue),
            dropdownDecoratorProps: DropDownDecoratorProps(
              textAlignVertical: TextAlignVertical.center,
              dropdownSearchDecoration: InputDecoration(
                labelText: 'Choose the park',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(50),
                ),
              ),
            ),
            onChanged: (value) {
              setState(() {
                selectedPark = value.toString();
                getParkId(selectedPark);
              });
            },

            selectedItem: selectedPark,

          ),

          SizedBox(height: 40,),
          MaterialButton(onPressed: (){
            TripRides(parkId: parkId, id: id);
          },
          child: Text("Add rides to the trip", style: TextStyle(color: Colors.white),),
          color: Colors.blue,),

        ],
      ),
    );
  }

  void getParkId(String selectedPark){
    parkList.forEach((key, value) {
      if (key == selectedPark){
        setState(() {
          parkId = value;
          Fluttertoast.showToast(msg: parkId.toString());
        });
      }
    });
  }


  Future<void> _selectDate() async{
    DateTime? _picked = await showDatePicker(
        context: context,
        initialDate: DateTime.now(),
        firstDate: DateTime.now(),
        lastDate: DateTime(2100)
    );

    if (_picked != null){
      setState(() {
        _dateController.text = _picked.toString().split(" ")[0];
      });
    }
  }
}

class TripRides extends StatefulWidget{
  int id;
  int parkId;

  TripRides({super.key, required this.parkId, required this.id});

  @override
  State<TripRides> createState() => _TripRides();
}

class _TripRides extends State<TripRides>{
  late int id;
  late int parkId;
  late int tripId;
  late String parkName;
  Map<String, List<int>> rideWaits = {};
  Map<int, int> avgWaits = {};
  List<int> plannedRides = [];
  late String currAvg;
  List<int> savedRidesAvgWaits = [];
  List<String> savedRidesAvgWaitsString = [];


  
  @override
  void initState(){
    super.initState();
    id = widget.id;
    parkId = widget.parkId;
    getData();
    getAvgs();
  }

  int currDayTime = 0;

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
              else{
                curr.add(ride.waitTime);
              }

              // add the id to the list as well to match it with average waits
              curr.add(ride.id);
              // getAvgData(ride.id);
              // curr.add(avgWaits[ride.id]!);
              // print(curr);
              rideWaits.putIfAbsent(ride.name, () => curr);

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

  @override
  Widget build(BuildContext context) {
    int wait;
    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        title: Text("Make a trip"),
        titleTextStyle: const TextStyle(
            fontWeight: FontWeight.bold, fontSize: 15, color: Colors.white),
      ),
      body: Column(
          children: [
          SizedBox(height: 70),
      Text("Current Trip est. Time: $currDayTime"),
      SizedBox(height: 30),
      Container(
        margin: const EdgeInsets.all(10),
        child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
            SizedBox(height: 30),
        Text("Your current planned rides"),
        Expanded(
          flex: 1,
          child: ListView.builder(
            itemCount: plannedRides.length,
            itemBuilder: (context, index) =>
                Card(
                  color: Colors.indigo,
                  elevation: 4,
                  margin: const EdgeInsets.symmetric(vertical: 8.0),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Expanded(
                        flex: 7,
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Container(
                              padding: const EdgeInsets.all(7.0),
                              child: Text(rideWaits.keys.firstWhere((
                                  k) => rideWaits[k]?[1] == plannedRides[index],
                                  orElse: () => ""),
                                overflow: TextOverflow.ellipsis,
                                style: TextStyle( fontSize: 17, color: Colors.white),),
                            )
                          ],
                        ),
                      ),
                      Expanded(
                        flex: 3,
                        child: Column(
                          children: [
                            Text("Average", style: TextStyle(color: Colors
                                .white)),
                            Container(
                                height: 35,
                                width: 35,
                                color: Colors.white,
                                child: Text(savedRidesAvgWaitsString[index],style: TextStyle(color: Colors.black, fontSize: 17), textAlign: TextAlign.center),
                                ),
                              ],
                            ),
                          ),
                      IconButton(
                        iconSize: 50,
                        color: Colors.white,
                        icon: const Icon(
                          Icons.remove,
                        ),
                        onPressed: () {
                          // remove ride api call
                        },
                      )
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
         ),
            FloatingActionButton(
              child: const Icon(Icons.add),
                onPressed: () {

                },
            ),
        ],
      ),
    );
  }


}


class Trips {
  final int userId;
  final DateTime startDate;
  final DateTime endDate;
  final int parkId;
  final String name;
  final List<int> rides;

  const Trips({
    required this.userId,
    required this.startDate,
    required this.endDate,
    required this.parkId,
    required this.rides,
    required this.name,
  });

  factory Trips.formJson(Map<String, dynamic> json){
    return switch (json){
      {
      'userId': int userId,
      'startDate': DateTime startDate,
      'endDate': DateTime endDate,
      'parkId': int parkId,
      'rides': List<int> rides,
      'name': String name,
      } =>
          Trips(
            userId: userId,
            startDate: startDate,
            endDate: endDate,
            parkId: parkId,
            rides: rides,
            name: name,
          ),
      _ => throw const FormatException('Failed to load trips.'),
    };
  }
}

class Ride {
  final int id;
  final String name;
  final bool isOpen;
  final int waitTime;
  final DateTime lastUpdated;

  const Ride({
    required this.id,
    required this.name,
    required this.isOpen,
    required this.waitTime,
    required this.lastUpdated,
  });
}

class Land {
  final int id;
  final String name;
  final List<Ride> rides;

  const Land({
    required this.id,
    required this.name,
    required this.rides,
  });
}

class Root{
  final List<Land> lands;
  final List<Ride> rides;

  const Root({
    required this.lands,
    required this.rides,
  });
}
