import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:theme_park_tracker/tabs/listItems.dart';
import 'package:dio/dio.dart';

class SavedParks extends StatefulWidget{
  List<int> parkArr;
  SavedParks({super.key, required this.parkArr});

  @override
  State<SavedParks> createState() => _SavedParks();
}

class _SavedParks extends State<SavedParks>{
  var parkList;
  late List<int> parkArr;
  List<String> savedParkArr = [];



  @override
  void initState() {
    parkArr = widget.parkArr;
    super.initState();
    getData();
  }

  void getData() async{
    try{
      var response = await Dio().get('https://queue-times.com/parks.json');
      if (response.statusCode == 200){
        setState(() {
          parkList = response.data as List;
          for (int i = 0; i < parkList.length; i++){
            for (int j = 0; j < parkList[i]['parks'].length; j++){
              if (parkArr.contains(parkList[i]['parks'][j]['id'])){
                  savedParkArr.add(parkList[i]['parks'][j]['name']);

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
    return Scaffold(
      body: Column(
        children: [
          Expanded(
            flex: 1,
              child: ListView.builder(
                itemCount: savedParkArr.length,
                itemBuilder: (context, index){
                  return listItem(parkName: savedParkArr[index], parkNum: parkArr[index]);
                })),
        ],
      )

    );
  }

}

class WaitTimes extends StatefulWidget{
  int parkNum;
  String parkName;
  WaitTimes({super.key, required this.parkNum, required this.parkName});

  @override
  State<WaitTimes> createState() => _WaitTimes();

}

class _WaitTimes extends State<WaitTimes>{
  late int parkNum;
  late String parkName;
  List<Land> avgTimes = [];
  var waitArr;
  Map<String, List<int>> rideWaits = {};
  Map<int, int> avgWaits = {};



  @override
  void initState() {
    parkNum = widget.parkNum;
    parkName = widget.parkName;
    super.initState();
    getData();
  }

  void getData() async{
    try{
      var response = await Dio().get('https://queue-times.com/parks/$parkNum/queue_times.json');
      if (response.statusCode == 200){
        setState(() {
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
             curr.add(ride.waitTime);
             getAvgData(ride.id);
             curr.add(avgWaits[ride.id]!);
             print(curr);
             rideWaits.putIfAbsent(ride.name, () => curr);
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

  void getAvgData(rideNum) async {
    try{
      var response = await Dio().get('https://queue-times.com/en-US/parks/$parkNum/rides/$rideNum/average_histogram.json');
      if (response.statusCode == 200) {
        setState(() {
            String respString = response.toString();

            // parse the string into map , dynamic to be able to handle it
            Map<String, dynamic> jsonMap = jsonDecode(respString);

            // map the string dynamics into new entries of string and double
            // this way we have a string with range of values and the double reflecting their occurence rate on the histogram
            Map<String, double> avgMap = jsonMap.map((key, value) {
              return MapEntry(key, value.toDouble());
            });

            double max = 0;
            String maxKey = "";

            avgMap.forEach((key, value) {
              if (value > max){
                max = value;
                maxKey = key;
              }
            });

            // only do splits if wait exists
            if (avgMap.length > 0){
              // split by the - to get second number and then remove whitespace after
              List<String> split = maxKey.split("-");
              List<String> nextSplit = split[1].split(" ");
              avgWaits.putIfAbsent(rideNum, () => int.parse(nextSplit[0]));
              print("entered");
            }
            else {
              avgWaits.putIfAbsent(rideNum, () => 0);
            }



        });
      };
    } catch(e){
      print(e);
    }
  }

  @override
  Widget build(BuildContext context) {
    // appBarTheme: const AppBarTheme(color: Colors.indigo);
    return Scaffold(
      appBar:  AppBar(
          centerTitle: true,
          title: Text(parkName),
          titleTextStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Colors.white),
        ),
        body: Column(
          children: [
            Expanded(
              flex: 1,
              child: ListView.builder(
                itemCount: 1,
                itemBuilder: (context, index){
                  return waitTimeItem(currWaitTime: 45, avgWaitTime: 30, rideName: "Hagrids Harry potter bike ride thing");
                }
              ),

            )
            ]
    ));

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
// class Park {
//   final int id;
//   final String name;
//   final String country;
//   final String continent;
//   final String latitude;
//   final String longitude;
//   final String timezone;
//
//
//   const Park({
//     required this.id,
//     required this.name,
//     required this.country,
//     required this.continent,
//     required this.latitude,
//     required this.longitude,
//     required this.timezone,
//   });
//
//   Park.fromJson(Map<String, dynamic> json)
//       : name = json['name'] as String,
//         id = json['id'] as int,
//         country = json['country'] as String,
//         continent = json['continent'] as String,
//         latitude = json['latitude'] as String,
//         longitude = json['longitude'] as String,
//         timezone = json['timezone'] as String;
//
//   Map<String, dynamic> toJson() => {
//     'name': name,
//     'id' : id,
//     'country' : country,
//     'continent' : continent,
//     'latitude' : latitude,
//     'longitude' : longitude,
//     'timezone' : timezone,
//
//   };

  // factory Park.fromJson(Map<String, dynamic> json) {
  //   return switch (json) {
  //     {
  //     'id': int id,
  //     'name': String name,
  //     'country': String country,
  //     'continent': String continent,
  //     'latitude': String latitude,
  //     'longitude': String longitude,
  //     'timezone': String timezone,
  //     } =>
  //         Park(
  //           id: id,
  //           name: name,
  //           country: country,
  //           continent: continent,
  //           latitude: latitude,
  //           longitude: longitude,
  //           timezone: timezone,
  //         ),
  //     _ => throw const FormatException('Failed to load Park.'),
  //   };
  // }

