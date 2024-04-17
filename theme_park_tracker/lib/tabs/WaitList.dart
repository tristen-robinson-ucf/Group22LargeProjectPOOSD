import 'package:flutter/cupertino.dart';

import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:theme_park_tracker/tabs/listItems.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:dio/dio.dart';
import 'package:http/http.dart' as http;
import 'package:theme_park_tracker/main.dart';

import 'SavedParks.dart';


class WaitTimes extends StatefulWidget{
  int parkNum;
  String parkName;
  String firstname, lastname;
  List<int> parkArr;
  int id;
  WaitTimes({super.key, required this.parkNum, required this.parkName, required this.firstname, required this.lastname, required this.parkArr, required this.id});

  @override
  State<WaitTimes> createState() => _WaitTimes();

}

class _WaitTimes extends State<WaitTimes>{
  late int parkNum;
  late String parkName;
  var waitArr;
  Map<String, List<int>> rideWaits = {};
  Map<int, int> avgWaits = {};

  late String firstname, lastname;
  late List<int> parkArr;
  late int id;



  @override
  void initState() {
    parkNum = widget.parkNum;
    parkName = widget.parkName;
    firstname = widget.firstname;
    lastname = widget.lastname;
    id = widget.id;
    parkArr = widget.parkArr;
    super.initState();
    getData();
  }

  void getData() async{
    try{
      var response = await Dio().get('https://queue-times.com/parks/$parkNum/queue_times.json');
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

              curr.add(ride.id);
              // getAvgData(ride.id);
              // curr.add(avgWaits[ride.id]!);
              // print(curr);
              rideWaits.putIfAbsent(ride.name, () => curr);

              try{
                var rideNum = ride.id;
                var response2 = await Dio().get(
                    'https://queue-times.com/en-US/parks/$parkNum/rides/$rideNum/average_histogram.json');
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

                    // go through the histogram and store the max value and key (minute range) in the variables initialized above
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
                    }
                    // if there were no wait times for this ride, put 0
                    else{
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

  @override
  Widget build(BuildContext context) {
    // appBarTheme: const AppBarTheme(color: Colors.indigo);
    return Scaffold(
        backgroundColor: Theme.of(context).colorScheme.background,
        appBar:  AppBar(
          centerTitle: true,
          title: Text(parkName, style: TextStyle(fontSize: 15, color: Colors.white)),
          backgroundColor: Theme.of(context).colorScheme.primary,
          automaticallyImplyLeading: false,
          leading: IconButton(
              onPressed: (){
                Navigator.push((context), MaterialPageRoute(builder: (context) => LandingPage(id: id, parkArr: parkArr, firstname: firstname, lastname: lastname,)));
              },
              icon: Icon(Icons.arrow_back, color: Colors.white)),

        ),
        body: Column(
            children: [
              Expanded(
                flex: 1,

                child:
                    Container(
                      padding: const EdgeInsets.all(8),

                      child:
                ListView.builder(
                    itemCount: avgWaits.length,
                    itemBuilder: (context, index){
                      String key = rideWaits.keys.elementAt(index);
                      return waitTimeItem(currWaitTime: rideWaits.values.elementAt(index)[0], avgWaitTime: avgWaits.values.elementAt(index), rideName: key);
                    }
                ),

              ),
              ),
            ]
        ),
        );

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