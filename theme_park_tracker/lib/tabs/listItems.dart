import 'package:flutter/material.dart';
import 'package:mongo_dart/mongo_dart.dart';

import 'SavedParks.dart';

class listItem extends StatelessWidget {
  final String parkName;
  final int parkNum;

  listItem({required this.parkName, required this.parkNum});

  
  @override
  Widget build(BuildContext context) {
    // TODO: implement build
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
                   // add the name of the park that is passed in
                   Text(parkName, style: TextStyle(fontSize: 20, color: Colors.white)),

                   // add a button that will allow the user to see the wait times for this park number
                   // calls function wait times in SavedParks file
                   SizedBox(height: 15),
                    MaterialButton(
                       onPressed: (){
                         Navigator.push(context, MaterialPageRoute(builder: (context) => WaitTimes(parkNum: parkNum, parkName: parkName)));
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
              width: 5,
              color: Colors.black38,
            )
        ),
        child:  Container(
          padding: const EdgeInsets.all(15),
          color: Colors.indigo,
          height: 90,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
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
                  child: Text(rideName, overflow: TextOverflow.ellipsis, style: TextStyle(fontSize: 17, color: Colors.white)),
                ),]
                )),


              // add a button that will allow the user to see the wait times for this park number
              // calls function wait times in SavedParks file
              Expanded(
                flex: 3,
                child: Column(
                  children: [
                    Text("Current", style: TextStyle(color: Colors.white)),
                   Container(
                    height: 35,
                    width: 35,
                    color: chooseColor(avgWaitTime, currWaitTime),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [Text(currWaitTime.toString(), style: TextStyle(color: Colors.black, fontSize: 17), textAlign: TextAlign.center)],
                    )
                  )
                ]),
              ),

              Expanded(
                flex: 3,
                child: Column(
                    children: [
                      Text("Average", style: TextStyle(color: Colors.white)),
                      Container(
                          height: 35,
                          width: 35,
                          color: Colors.white,
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
    double diff = currWaitTime / avgWaitTime;

    if (diff < .9) return Colors.green;
    else if (diff >= .9 && diff <= 1.1) return Colors.yellow;
    else return Colors.redAccent;
  }

}

