
import 'package:flutter/cupertino.dart';

import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:hexcolor/hexcolor.dart';
import 'package:theme_park_tracker/tabs/listItems.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:dio/dio.dart';
import 'package:http/http.dart' as http;
import 'package:theme_park_tracker/main.dart';

import 'SavedParks.dart';

class AddParks extends StatefulWidget{
  List<int> parkArr;
  int id;
  String firstname, lastname;
  AddParks({super.key, required this.parkArr, required this.id, required this.firstname, required this.lastname});

  @override
  State<AddParks> createState() => _AddParks();

}

class _AddParks extends State<AddParks>{
  List<int> parkArr = [];
  List<String> toDisplay = [];
  Map<String, int> nameId = {};
  Map<String, int> filteredParks = {};
  int id = 0;
  late String firstname, lastname;
  var parkList;
  TextEditingController controller = TextEditingController();

  @override
  void initState() {
    parkArr = widget.parkArr;
    id = widget.id;
    firstname = widget.firstname;
    lastname = widget.lastname;
    super.initState();
    getData();
    filteredParks = nameId;
  }

  void getData() async{
    try{
      var response = await Dio().get('https://queue-times.com/parks.json');
      if (response.statusCode == 200){
        setState(() {
          parkList = response.data as List;
          for (int i = 0; i < parkList.length; i++){
            for (int j = 0; j < parkList[i]['parks'].length; j++){
              if (!parkArr.contains(parkList[i]['parks'][j]['id'])){
                nameId.putIfAbsent(parkList[i]['parks'][j]['name'], () =>parkList[i]['parks'][j]['id']);
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
        appBar:  AppBar(
          centerTitle: true,
          title: Text("Save Parks"),
          titleTextStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Colors.white),
          automaticallyImplyLeading: false,
          leading: IconButton(
              onPressed: (){
                Navigator.push((context), MaterialPageRoute(builder: (context) => LandingPage(id: id, parkArr: parkArr, firstname: firstname, lastname: lastname,)));
              },
              icon: const Icon(Icons.arrow_back),
              color: Colors.white,
          ),
        ),
        body: Padding(
            padding: EdgeInsets.all(8.0),
            child: Column(children: [
              SizedBox(height: 20),
              Container(
                margin: const EdgeInsets.all(14),
                // create a search bar where the parks available are filtered whenever something is typed
                child: TextField(
                  controller: controller,
                  decoration: InputDecoration(
                    prefixIcon: const Icon(Icons.search),
                    hintText: "Park Name",
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(4),
                      borderSide: const BorderSide(color: Colors.blue),
                    ),
                  ),
                  onChanged: (value) => runFilter(controller.text),
                ),
              ),
              SizedBox(height: 20),
              Expanded(
                // create the list of parks with name of park and a + icon to add to saved array
                  flex: 1,
                  child: ListView.builder(
                      itemCount:filteredParks.length,
                      itemBuilder: (context, index) => Card(
                        color: HexColor("Eb5756"),
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
                                    padding: const EdgeInsets.all(7),
                                    child: Text(filteredParks.keys.elementAt(index), overflow: TextOverflow.ellipsis, style: TextStyle(fontSize: 17, color: Colors.white)),
                                  )
                                ],
                              ),

                            ),
                            IconButton(
                              iconSize: 50,
                              color: Colors.white,
                              icon: const Icon(
                                Icons.add,
                              ),
                              onPressed: () { addPark(filteredParks.values.elementAt(index), id); },

                            )
                          ],
                        ),

                      )
                  )
              )])
        )

    );
  }
  // update the list of parks based on the search input by the user,
  // override filtered parks rather than nameId map to keep the whole list from API stored
  void runFilter(String text) {
    Map<String, int> results = {};
    if (text.isEmpty){
      results = nameId;
    } else {
      nameId.forEach((key, value) {
        if (key.toLowerCase().contains(text.toLowerCase())){
          results.putIfAbsent(key, () => value);
        }
      });
    }

    setState(() {
      filteredParks = results;
    });
  }

  Future<void> addPark(int parkNum, int id) async {
    final response = await http.post(
        Uri.parse('https://group-22-0b4387ea5ed6.herokuapp.com/api/addPark'),
        headers: <String, String>{
          'Content-Type': 'application/json',
        },
        body: jsonEncode(<String, int>{
          'userID' : id,
          'parkID': parkNum,
        })
    );
    if (response.statusCode == 200){
      parkArr.add(parkNum);
      Fluttertoast.showToast(msg: "Added Park");
    }
    else {
      Fluttertoast.showToast(msg: response.statusCode.toString());
    }

  }

}

