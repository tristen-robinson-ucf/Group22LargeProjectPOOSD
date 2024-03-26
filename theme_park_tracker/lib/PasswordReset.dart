import 'dart:convert';
import 'dart:ffi';
import 'dart:async';
import 'dart:io';
import 'dart:math';

import 'package:dio/dio.dart';
import 'package:email_validator/email_validator.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter/widgets.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:mongo_dart/mongo_dart.dart' as mongo;
import 'package:theme_park_tracker/register.dart';
import 'package:theme_park_tracker/tabs/PlannedTrips.dart';
import 'package:theme_park_tracker/tabs/SavedParks.dart';

import 'main.dart';



Future<passwordReset> authenticatePasswordReset(String username) async {
  final response = await http.post(
    Uri.parse('https://group-22-0b4387ea5ed6.herokuapp.com/api/password'),
    headers: <String, String>{
      'Content-Type': 'application/json',
    },
    body: jsonEncode(<String, String>{
      'username': username.trim(),
    }),
  );

  if (response.statusCode == 200) {
    return passwordReset.fromJson(jsonDecode(response.body) as Map<String, dynamic>);
  }
  else {
    throw Exception('Failed to create user.');
  }
}

class passwordReset {
  final String username;
  final String password;
  final String email;
  final String error;

  const passwordReset({
    required this.username,
    required this.password,
    required this.email,
    required this.error,
  });

  factory passwordReset.fromJson(Map<String, dynamic> json) {
    if (json.containsKey('username') &&
        json.containsKey('password') &&
        json.containsKey('email') &&
        json.containsKey('error')) {
      return passwordReset(
        username: json['username'],
        password: json['password'],
        email: json['email'],
        error: json['error'],
      );
    } else {
      throw FormatException('Failed to get User.');
    }
  }
}




class PasswordReset extends StatefulWidget {
  const PasswordReset({super.key});

  @override
  State<PasswordReset> createState() => _PasswordReset();
}

class _PasswordReset extends State<PasswordReset>{
  TextEditingController _username = TextEditingController();
  TextEditingController _codeController = TextEditingController();
  TextEditingController  _passwordController = TextEditingController();
  late String user;
  late String code;
  late String password;

  bool _validateUser = false;
  bool _validateEmail = false;
  bool _validatePassword = false;

  Future<passwordReset>? _futureUser;



  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: "Park Pal",
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        appBarTheme: const AppBarTheme(color: Colors.indigo),
      ),
      home: Scaffold(
        appBar: AppBar(
          centerTitle: true,
          title: const Text('Park Pal'),
          titleTextStyle: const TextStyle(
              fontWeight: FontWeight.bold, fontSize: 20, color: Colors.white),
        ),
        body: Column(
          children:[
            Container(
              alignment: Alignment.center,
              padding: const EdgeInsets.all(8),
              child: (_futureUser == null) ? buildColumn() : buildFutureBuilder(),
            ),
          ],

        ),
      ),
    );
  }

  Column buildColumn() {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: <Widget> [
        SizedBox(height: 30),
        TextField(
            controller: _username,
            decoration: InputDecoration(
                hintText: "Enter the username of your account",
                errorText: _validateUser ? "Please enter your account's username" : null,
                border: OutlineInputBorder(),
                suffixIcon: IconButton(
                  onPressed: (){
                    _username.clear();
                  },
                  icon: const Icon(Icons.clear),
                )
            )
        ),

        SizedBox(height: 30,),
        MaterialButton(
          onPressed: () {
            user = _username.text;

            // update validate vars to reflect completeness of the fields,
            // turn on error text if any are empty, if not go through with registration
            setState(() {
              _validateUser = user.isEmpty;

              if (!_validateUser) {
                _futureUser = authenticatePasswordReset(user);
              };
            });

          },
          color: Colors.blueAccent,
          child: const Text('Register', style: TextStyle(color: Colors.white)),

        )
      ],
    );
  }

  FutureBuilder<passwordReset> buildFutureBuilder() {
    return FutureBuilder<passwordReset>(
      future: _futureUser,
      builder: (context, snapshot) {
        if (snapshot.hasData && snapshot.data!.error.isEmpty) {
          final user = snapshot.data;
            SchedulerBinding.instance.addPostFrameCallback((_) {
              Navigator.push(context, MaterialPageRoute( builder: (context) => verifyReset(email: snapshot.data!.email, username: snapshot.data!.username, password: snapshot.data!.password,)));
            });
            return Container();

            //Navigator.push( context, MaterialPageRoute( builder: (context) => _landingPage(firstName: user!.firstname, lastName: user!.lastname, id: user!.id)));

          return Container();
        } else if (snapshot.hasError) {
          return Text('${snapshot.error}');
        } else if (snapshot.hasData && snapshot.data!.error.isNotEmpty){
          Fluttertoast.showToast(msg: "Not able to find this user");
          return buildColumn();
        }

        return const CircularProgressIndicator();
      },
    );
  }
}

class verifyReset extends StatefulWidget{
  String email;
  String username;
  String password;

  verifyReset({super.key, required this.email, required this.username, required this.password});

  @override
  State<verifyReset> createState() => _verifyReset();
}

class _verifyReset extends State<verifyReset>{
  late String username;
  late String password;
  late String email;

  TextEditingController _codeController = TextEditingController();

  Random random = Random();
  int testVal = 0;



  @override
  void initState(){
    super.initState();
    email = widget.email;
    username = widget.username;
    password = widget.password;
    testVal = random.nextInt(90000) + 10000;
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Park Pal',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        appBarTheme: const AppBarTheme(color: Colors.indigo),
      ),
      home: Scaffold(
          appBar: AppBar(
            centerTitle: true,
            title: const Text('Verify your email'),
            titleTextStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 20, color: Colors.white),
          ),
          body: Column(
              children:[
                Container(
                  alignment: Alignment.center,
                  padding: const EdgeInsets.all(8),
                  // request code to email
                  child: MaterialButton(
                    onPressed: () {
                      sendEmail("", email, "Confirm your email for Park Pal", "Your one time code is $testVal");
                    },
                    color: Colors.blueAccent,
                    child: const Text('Send verification email', style: TextStyle(color: Colors.white)),
                  ),
                ),

                SizedBox(height: 70),
                Container(
                  padding: const EdgeInsets.all(8.0),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      TextField(
                        controller: _codeController,
                        decoration: const InputDecoration(
                          hintText: "Enter one time code",
                          border: OutlineInputBorder(),
                        ),
                      ),
                      const SizedBox(height: 30),
                      // button for user to test if their code matches OTP
                      MaterialButton(
                        onPressed: (){
                          int code = int.parse(_codeController.text);
                          if (code == testVal){
                            Navigator.push( context, MaterialPageRoute( builder: (context) => passwordResetPage(username: username, password: password)));
                          } else{
                            Fluttertoast.showToast(msg: "Incorrect code, try again or request another");
                          }
                        },
                        color: Colors.blueAccent,
                        child: const Text('Confirm', style: TextStyle(color: Colors.white)),

                      )
                    ],
                  ),
                )
              ]

          )

      ),
    );
  }
}

// utilize API to send an email containing code to the email the user input
Future<void> sendEmail(String firstName, String email, String subject, String message) async {

  Map<String, dynamic> jsonData = {
    'service_id': 'service_tzia2it',
    'template_id': 'template_ftem2gf',
    'user_id' : 'JPEruMpPDs6QC1-DJ',
    'template_params': {
      'user_name': firstName,
      'user_email': email,
      'sender_email': 'mriosa7@gmail.com',
      'user_subject': subject,
      'user_message': message,
    },
  };

  final response = await http.post(
    Uri.parse('https://api.emailjs.com/api/v1.0/email/send'),
    headers: <String, String>{
      'origin': 'http://localhost',
      'Content-Type': 'application/json',
    },
    body: json.encode(jsonData),
  );

  if(response.statusCode == 200){
    Fluttertoast.showToast(msg: "Email sent");
  }
  else{
    Fluttertoast.showToast(msg: "Could not verify");
  }
}


class passwordResetPage extends StatefulWidget{
  String username;
  String password;

  passwordResetPage({super.key, required this.username, required this.password});

  @override
  State<passwordResetPage> createState() => _passwordResetPage();
}

class _passwordResetPage extends State<passwordResetPage> {
  late String username;
  late String password;
  late String email;

  TextEditingController _newPasswordController = TextEditingController();
  String newPassword = "";
  String newPassword2 = "";
  TextEditingController _newPasswordController2 = TextEditingController();

  bool _validatePasswords = false;

  @override
  void initState(){
    super.initState();
    username = widget.username;
    password = widget.password;
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Park Pal',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        appBarTheme: const AppBarTheme(color: Colors.indigo),
      ),
      home: Scaffold(
        appBar: AppBar(
          centerTitle: true,
          title: const Text('Park Pal'),
          titleTextStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 20, color: Colors.white),
        ),
        body: SingleChildScrollView(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              SizedBox(height: 30),
              const FittedBox(
                fit: BoxFit.scaleDown,
                child: Text(
                  "Reset your password",
                  style: TextStyle(fontSize: 30),
                ),
              ),
              SizedBox(height: 30),
              // create text fields for user to input their passwords, one for new and one to confirm the new password
              Container(
                padding: const EdgeInsets.all(15),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    SizedBox(height: 30),
                    TextField(
                      obscureText: true,
                      controller: _newPasswordController,
                      decoration: InputDecoration(
                        hintText: "New Password",
                        border: OutlineInputBorder(),
                        errorText: _validatePasswords ? "Please enter matching passwords" : null,
                        suffixIcon: IconButton(
                          onPressed: (){
                            _newPasswordController.clear();
                          },
                          icon: const Icon(Icons.clear),
                        )
                      ),
                    ),
                    SizedBox(height: 30),
                    TextField(
                      obscureText: true,
                      controller: _newPasswordController2,
                      decoration: InputDecoration(
                          hintText: "Confirm new Password",
                          border: OutlineInputBorder(),
                          errorText: _validatePasswords ? "Please enter matching passwords" : null,
                          suffixIcon: IconButton(
                            onPressed: (){
                              _newPasswordController2.clear();
                            },
                            icon: const Icon(Icons.clear),
                          )
                      ),
                    ),
                  ],
                ),
              ),
              SizedBox(height: 30),
              MaterialButton(
                  onPressed: (){
                    newPassword = _newPasswordController.text;
                    newPassword2 = _newPasswordController2.text;

                    setState(() {
                      // ensure that both of the fields are filled out and that both passwords match
                      if (newPassword2.isNotEmpty && newPassword.isNotEmpty && newPassword == newPassword2){
                        _validatePasswords = true;
                      }

                      // send the user back to the login page when password is reset
                      if (_validatePasswords){
                        completeReset(username, newPassword);
                        Navigator.push(context, MaterialPageRoute(builder: (context) => const MyApp()));
                      }
                    });
                  },
                child: const Text('Reset', style: TextStyle(color: Colors.white)),
                color: Colors.blueAccent,


              ),
            ],
          )

        ),
      ),
    );
  }

  Future<void> completeReset(String username, String password) async{
    final response = await Dio().post(
      'https://group-22-0b4387ea5ed6.herokuapp.com/api/updatePassword',
      options: Options(headers: {
        'Content-Type': 'application/json',
      }),
      data: {
        'username': username,
        'password': password,
      },
    );
    if (response.statusCode == 200){
      Fluttertoast.showToast(msg: "Password Updated");
    }
    else {
      Fluttertoast.showToast(msg: response.statusCode.toString());
    }
  }
}


