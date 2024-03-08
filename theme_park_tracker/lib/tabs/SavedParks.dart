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


  @override
  void initState() {
    parkNum = widget.parkNum;
    parkName = widget.parkName;
    super.initState();
    getData();
  }

  void getData() async{
    // try{
    //   var response = await Dio().get('https://queue-times.com/parks.json');
    //   if (response.statusCode == 200){
    //     setState(() {
    //       parkList = response.data as List;
    //       for (int i = 0; i < parkList.length; i++){
    //         for (int j = 0; j < parkList[i]['parks'].length; j++){
    //           if (parkArr.contains(parkList[i]['parks'][j]['id'])){
    //             savedParkArr.add(parkList[i]['parks'][j]['name']);
    //
    //           }
    //         }
    //       }
    //     });
    //
    //
    //   } else{
    //     print(response.statusCode);
    //   }
    // } catch(e){
    //   print(e);
    // }
  }

  @override
  Widget build(BuildContext context) {
    // appBarTheme: const AppBarTheme(color: Colors.indigo);
    return Scaffold(
      appBar:  AppBar(
          centerTitle: true,
          title: Text('Wait times for ' + parkName),
          titleTextStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Colors.white),
        ),
        body: Column(
          children: [
            ]
    ));

  }

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
//
//   // factory Park.fromJson(Map<String, dynamic> json) {
//   //   return switch (json) {
//   //     {
//   //     'id': int id,
//   //     'name': String name,
//   //     'country': String country,
//   //     'continent': String continent,
//   //     'latitude': String latitude,
//   //     'longitude': String longitude,
//   //     'timezone': String timezone,
//   //     } =>
//   //         Park(
//   //           id: id,
//   //           name: name,
//   //           country: country,
//   //           continent: continent,
//   //           latitude: latitude,
//   //           longitude: longitude,
//   //           timezone: timezone,
//   //         ),
//   //     _ => throw const FormatException('Failed to load Park.'),
//   //   };
//   // }
// }
