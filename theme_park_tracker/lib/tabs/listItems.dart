import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:hexcolor/hexcolor.dart';
import 'package:mongo_dart/mongo_dart.dart';
import 'package:http/http.dart' as http;

import '../main.dart';
import 'SavedParks.dart';
import 'WaitList.dart';

class listItem extends StatelessWidget {
  final String parkName;
  final int parkNum;
  final int userId;
  final String firstname, lastname;
  final List<int> parkArr;

  listItem({required this.parkName, required this.parkNum, required this.firstname, required this.lastname, required this.parkArr, required this.userId});

  
  @override
  Widget build(BuildContext context) {
   return Padding(
       padding: const EdgeInsets.symmetric(vertical: 8.0),
       child: Container(
         decoration: BoxDecoration(
           border: Border.all(
             width: 5,
             color: Colors.black38,
           )
         ),
            child:  Container(
               color: Colors.indigo,
               height: 150,
               child: Column(
                 mainAxisAlignment: MainAxisAlignment.center,
                 // alignment: Alignment.centerLeft,
                 // padding: EdgeInsets.all(15.0),
                 children: [
                   Row(
                       mainAxisAlignment: MainAxisAlignment.center,
                     children: [
                       Expanded(
                         flex: 7,
                         child: Column(
                           mainAxisAlignment: MainAxisAlignment.center,
                           children: [
                             Container(
                               padding: const EdgeInsets.all(7),
                                // add the name of the park that is passed in
                              child: Text(parkName, style: TextStyle(fontSize: 20, color: Colors.white)),
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
                             removePark(parkNum, userId);
                             Navigator.push(context, MaterialPageRoute(builder: (context) => LandingPage(id: userId, parkArr: parkArr, firstname: firstname, lastname: lastname)));
                             },
                       ),
                     ]
                   ),


                   // add a button that will allow the user to see the wait times for this park number
                   // calls function wait times in SavedParks file
                   SizedBox(height: 15),
                    MaterialButton(
                       onPressed: (){
                         Navigator.push(context, MaterialPageRoute(builder: (context) => WaitTimes(parkNum: parkNum, parkName: parkName, firstname: firstname, lastname: lastname, parkArr: parkArr, id: userId)));
                       },
                      color: Colors.white,
                     child: Text('See Wait Times', style: TextStyle(color: Colors.black) ),
                   )
                 ],

               ),
            ),
       ),
   );
  }
  Future<void> removePark(int parkNum, int id) async {
    final response = await http.post(
        Uri.parse('https://group-22-0b4387ea5ed6.herokuapp.com/api/deletePark'),
        headers: <String, String>{
          'Content-Type': 'application/json',
        },
        body: jsonEncode(<String, int>{
          'userID' : id,
          'parkID': parkNum,
        })
    );
    if (response.statusCode == 200){
      parkArr.remove(parkNum);
      Fluttertoast.showToast(msg: "Removed Park");
    }
    else {
      Fluttertoast.showToast(msg: response.statusCode.toString());
    }

  }

}

class waitTimeItem extends StatelessWidget{
  int currWaitTime;
  int avgWaitTime;
  String rideName;


  waitTimeItem({required this.currWaitTime, required this.avgWaitTime, required this.rideName});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Container(
        decoration: BoxDecoration(
            border: Border.all(
              width: 1,
              color: View.of(context).platformDispatcher.platformBrightness == Brightness.light ? Colors.black : Colors.grey,
            )
        ),
        child:  Container(
          padding: const EdgeInsets.all(15),
          color:  View.of(context).platformDispatcher.platformBrightness == Brightness.dark ? Colors.black : HexColor("Fb9c7E"),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            // alignment: Alignment.centerLeft,
            // padding: EdgeInsets.all(15.0),
            children: [
              // add the name of the park that is passed in
              Expanded(
                flex: 7,
                child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    padding: const EdgeInsets.all(7),
                  child: Text(rideName, overflow: TextOverflow.ellipsis, style: TextStyle(fontSize: 15,
                      color: Colors.white
                  )),
                ),]
                )),


              // add a button that will allow the user to see the wait times for this park number
              // calls function wait times in SavedParks file
              Expanded(
                flex: 2,
                child: Column(
                  children: [
                    Text("Current", style: TextStyle(color: Colors.white)),
                   Container(
                    height: 35,
                    width: 35,

                    decoration: BoxDecoration(
                      color: chooseColor(avgWaitTime, currWaitTime),
                      border: Border.all(width: 1.0, color: Colors.black),
                    ),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [Text(printCurr(currWaitTime), style: TextStyle(color: Colors.black, fontSize: 17), textAlign: TextAlign.center)],
                    )
                  )
                ]),
              ),

              Expanded(
                flex: 2,
                child: Column(
                    children: [
                      Text("Average", style: TextStyle(color: Colors.white)),
                      Container(
                          height: 35,
                          width: 35,
                          decoration: BoxDecoration(
                            color: Colors.white,
                            border: Border.all(width: 1.0, color: Colors.black),
                          ),
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            crossAxisAlignment: CrossAxisAlignment.center,
                            children: [Text(avgWaitTime.toString(), style: TextStyle(color: Colors.black, fontSize: 17), textAlign: TextAlign.center)],
                          )
                      )
                    ]),
              ),

            ],

          ),
        ),
      ),
    );
  }

  Color chooseColor(avgWaitTime, currWaitTime){
    if (currWaitTime == -1){
      return Colors.white;
    }
    double diff = currWaitTime / avgWaitTime;

    if (diff < .9 || (avgWaitTime == 0 && currWaitTime == 0)) return Colors.green;
    else if (diff >= .9 && diff <= 1.1) return Colors.yellow;
    else return Colors.red;
  }

  String printCurr(int currWaitTime) {
    if (currWaitTime == -1){
      return "N/A";
    }
    else {
      return currWaitTime.toString();
    }
  }
}



