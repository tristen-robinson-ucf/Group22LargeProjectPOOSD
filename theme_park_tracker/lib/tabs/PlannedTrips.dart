import 'dart:convert';
import 'dart:async';
import 'dart:developer';

import 'package:dio/dio.dart';

import 'package:flutter/cupertino.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter/widgets.dart';
import 'package:hexcolor/hexcolor.dart';
import 'package:http/http.dart' as http;
import 'package:fluttertoast/fluttertoast.dart';
import 'package:theme_park_tracker/main.dart';
import 'package:theme_park_tracker/tabs/SavedParks.dart';
import 'package:dropdown_search/dropdown_search.dart';
import 'package:theme_park_tracker/tabs/TripRides.dart';

class PlannedTrips extends StatefulWidget{
  int id;
  String firstname, lastname;
  List<int> parkArr;
  PlannedTrips({super.key, required this.id, required this.firstname, required this.lastname, required this.parkArr});

  @override
  State<PlannedTrips> createState() => _PlannedTrips();
}


class _PlannedTrips extends State<PlannedTrips>{
  int id = 0;
  late String firstname, lastname;
  List<Trips> trips = [];
  List<List<dynamic>> resultArr = [];
  var tripList;
  late List<int> parkArr;


  @override
  void initState() {
    super.initState();
    id = widget.id;
    firstname = widget.firstname;
    lastname = widget.lastname;
    parkArr = widget.parkArr;
    getData();
  }

  void getData() async{
    try{
      var response = await Dio().post( 'https://group-22-0b4387ea5ed6.herokuapp.com/api/searchTrip',
      options: Options(headers: {
        'Content-Type': 'application/json',
      }),
        data: {
          'userID': id,
          'search': '',
        },
      );
      if (response.statusCode == 200){
        var data = response.data as Map<String, dynamic>;

        setState(() {
            for (int i = 0; i < data['results'].length; i += 4){
              List<dynamic> currTrip = [];
              currTrip.add(data['results'][i]);
              currTrip.add(data['results'][i+ 1]);
              currTrip.add(data['results'][i + 2]);
              currTrip.add(data['results'][i + 3]);

              resultArr.add(currTrip);
            }

        });
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
                  child: (resultArr.isEmpty) ?
                      // if there are no results when searching for a users trips, make the screen show text that prompts a user to create a trip
                      // if there are trips then this is not shown
                      Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Container(
                            alignment: Alignment.center,
                            child: Text("Plan a trip!"),
                          )
                        ],
                      )
                      :
                  ListView.builder(
                      itemCount: resultArr.length,
                      itemBuilder: (context, index) => Card(
                          color: HexColor("Eb5756"),
                        elevation: 4,
                        margin: const EdgeInsets.symmetric(vertical: 8.0),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                          children: [
                            Expanded(
                              flex: 7,
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Container(
                                    padding: const EdgeInsets.all(7),
                                    child: Text(resultArr[index][0], overflow: TextOverflow.ellipsis, style: TextStyle(fontSize: 17, color: Colors.white)),
                                  ),
                                ],
                              ),

                            ),
                            Container(
                              padding: const EdgeInsets.only(left: 4.0, right: 10, top: 3.0, bottom: 3.0),
                                child: MaterialButton(
                                  onPressed: (){

                                    Navigator.push(context, MaterialPageRoute(builder: (context) => TripRides(parkId: resultArr[index][2], id: id, tripId: resultArr[index][1], rides: resultArr[index][3], firstname: firstname, lastname: lastname, parkArr: parkArr)));
                                    },

                                  color: Colors.white,
                                  child: const Text("Edit trip", style: TextStyle(color: Colors.black)),

                                ),
                            ),
                            Padding(
                              padding: EdgeInsets.all(8.0),
                              child: IconButton(
                                iconSize: 30,
                                color: Colors.white,
                                icon: const Icon(
                                  Icons.remove,
                                ),
                                onPressed: () {
                                  removeTrip(id, resultArr[index][0]);
                                  resultArr.remove(index);

                                  Navigator.push(context, MaterialPageRoute(builder: (context) => LandingPage(id: id, parkArr: parkArr, firstname: firstname, lastname: lastname)));
                                },
                              ),
                            )

                          ],
                        ),

                      ),
                      )
              ),
              MaterialButton(onPressed: () {
                Navigator.push(context, MaterialPageRoute(builder: (context) => MakeTrip(id: id, firstname: firstname, lastname: lastname, parkArr: parkArr)));
              },
                color: HexColor("#99dbFF"),
                child: Text('Make a new trip', style: TextStyle(color: Colors.black) ),

              )
            ],
          ),
        )
    );
  }

  // endpoint to remove a ride from a trips plan
  void removeTrip(int id, String tripName) async {
    final response = await http.post(
        Uri.parse('https://group-22-0b4387ea5ed6.herokuapp.com/api/deleteTrip'),
        headers: <String, String>{
          'Content-Type': 'application/json',
        },
        body: jsonEncode(<String, dynamic>{
          'userID' : id,
          'name' : tripName,
        })
    );
    if (response.statusCode == 200){
      Fluttertoast.showToast(msg: "Removed Trip");
    }
    else {
      Fluttertoast.showToast(msg: response.statusCode.toString());
    }

  }

}

class MakeTrip extends StatefulWidget{
  int id;
  String firstname, lastname;
  List<int> parkArr;
  MakeTrip({super.key, required this.id, required this.firstname, required this.lastname, required this.parkArr});

  @override
  State<MakeTrip> createState() => _MakeTrip();
}

class _MakeTrip extends State<MakeTrip>{
  late int id;
  late String date;
  late int parkId = 0;
  late int tripId = 0;
  late List<int> rides;
  late String tripName;
  late String firstname, lastname;
  late List<int> parkArr;


  Map<String, int> parkList = {};
  List<String> parkNames = [];
  var allParks;



  bool _validateName = false;
  bool _validateDate = false;
  bool _validatePark = false;
  bool _validateId = false;
  String selectedPark = '';

  TextEditingController _dateController = TextEditingController();
  TextEditingController _parkController = TextEditingController();
  TextEditingController _nameController = TextEditingController();


  @override
  void initState(){
    super.initState();
    id = widget.id;
    parkArr = widget.parkArr;
    firstname = widget.firstname;
    lastname = widget.lastname;
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
        titleTextStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Colors.black),
        backgroundColor: Colors.white,

      ),
      body: Container(
        width: double.infinity,
        height: double.infinity,

        decoration: BoxDecoration(
          color: HexColor("#99dbFF"),
        ),
        child: SingleChildScrollView(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                alignment: Alignment.topCenter,
                width: double.infinity,
                height: 150,


                decoration: BoxDecoration(
                  color: HexColor("#99dbFF"),

                ),
                child: Center(
                  child: Text("Plan a trip with Park Pal!", style: TextStyle(fontSize: 25),),
                ),
              ),
              Container(

                padding: const EdgeInsets.all(15),
                decoration: const BoxDecoration(
                  borderRadius: BorderRadius.vertical(top: Radius.circular(30.0), bottom: Radius.circular(30.0), ),
                  color: Colors.white,
                  boxShadow: [
                    BoxShadow(

                      offset: Offset(0.0, 1.0),
                      blurRadius: 5,
                    )
                  ]
                ),
                    child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Container(
                        padding: const EdgeInsets.all(15),
                        child: Center(
                          child: Text("Enter some information about your trip", style: TextStyle(color: Colors.black, fontSize: 16)),
                        ),
                      ),
                      SizedBox(height: 10),
                      Padding(
                        padding: const EdgeInsets.all(4.0),
                        child:TextField(
                            controller: _nameController,
                            decoration: InputDecoration(
                                hintText: "Trip name",
                                border: OutlineInputBorder(),
                                suffixIcon: IconButton(
                                  onPressed: () {
                                    _nameController.clear();
                                  },
                                  icon: const Icon(Icons.clear),
                                )
                            )
                        ),
                      ),

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
                        popupProps: const PopupProps.menu(
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

                      SizedBox(height: 35),
                      MaterialButton(onPressed: (){
                        tripName = _nameController.text;
                        date = _dateController.text;

                        setState(() {
                          _validateName = tripName.isEmpty;
                          _validateDate = date.isEmpty;
                          _validatePark = parkId == 0;

                          if (!_validatePark && !_validateDate && !_validateName){
                            addTrip(parkId, id, date, tripName);
                            Navigator.push(context, MaterialPageRoute(builder: (context) => LandingPage( id: id, firstname: firstname, lastname: lastname, parkArr: parkArr) ));
                          }
                          else{
                            Fluttertoast.showToast(msg: "Please ensure every field is completed.");
                          }
                        });

                      },
                        child: Text("Create Trip", style: TextStyle(color: Colors.black),),
                        color: HexColor("99dbFF")
                      ),
                    ],
                  ),
                ),

            ],
          ),
        ),
      ),
    );
  }

  void getParkId(String selectedPark){
    parkList.forEach((key, value) {
      if (key == selectedPark){
        setState(() {
          parkId = value;
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

  Future<void> addTrip(int parkId, int id, String date, String name) async {
    final response = await http.post(
        Uri.parse('https://group-22-0b4387ea5ed6.herokuapp.com/api/addTrip'),
        headers: <String, String>{
          'Content-Type': 'application/json',
        },
        body: jsonEncode(<String, dynamic>{
          'name': name,
          'startDate': date,
          'endDate': date,
          'userID' : id,
          'parkID': parkId,
        })
    );
    if (response.statusCode == 200){
      Fluttertoast.showToast(msg: "Trip created");
    }
    else {
      Fluttertoast.showToast(msg: response.statusCode.toString());
    }

  }

  Future<void> getTripId(String tripName, int id) async {
    final response = await Dio().post(
      'https://group-22-0b4387ea5ed6.herokuapp.com/api/searchTrip',
      options: Options(headers: {
        'Content-Type': 'application/json',
      }),
      data: {
        'userID': id,
        'search': tripName,
      },
    );
    if (response.statusCode == 200){
      var data = response.data as Map<String, dynamic>;
      setState(() {
          tripId = (data['results'][1]);
          _validateId = true;
      });
    }
    else {
      Fluttertoast.showToast(msg: response.statusCode.toString());
    }

  }
}




class Trips {
  //final int parkId;
  final List<dynamic> rides;
  final String tripName;
  final int tripId;
  final int parkId;

  const Trips({
   // required this.parkId,
    required this.rides,
    required this.tripName,
    required this.tripId,
    required this.parkId,
  });

  factory Trips.formJson(Map<String, dynamic> jsonMap){
    return Trips(
      tripName: jsonMap['tripName'],
      tripId: jsonMap['tripId'],

      parkId: jsonMap['parkId'],
      rides: jsonMap['rides'],
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
