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
import 'package:flutter/rendering.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter/widgets.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:hexcolor/hexcolor.dart';
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
        appBarTheme: AppBarTheme(color: HexColor("99dbFF")),
      ),
      home: Scaffold(
        appBar: AppBar(
          centerTitle: true,
          title: const Text('Park Pal'),
          titleTextStyle: const TextStyle(
              fontWeight: FontWeight.bold, fontSize: 20, color: Colors.white),
        ),
        body: Container(
          width: double.infinity,
          height: double.infinity,
          alignment: Alignment.center,
          padding: const EdgeInsets.all(8),
          child: (_futureUser == null) ?
              Center( child: buildColumn() ) : buildFutureBuilder(),

        ),
      ),
    );
  }

  Column buildColumn() {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: <Widget> [

              SizedBox(height: 30),
              Container(
                padding: const EdgeInsets.all(10),

                child: Center(
                  child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      padding: const EdgeInsets.only(bottom: 6),
                      child: Text("Get the email linked to your account.", style: TextStyle(color: Colors.black, fontSize: 15),),
                    ),
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

                    SizedBox(height: 10,),
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
                      color: HexColor("#99dbFF"),
                      child: const Text('Find email', style: TextStyle(color: Colors.black)),

                    )
                  ],
                ),
              ),
              ),

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
  late String firstPartEmail;
  late String secondPartEmail;

  final censoredEmail = StringBuffer();

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

    splitEmail();
  }

  // censor the email so we don't display the whole thing once the user enters a username
  void splitEmail(){
    List<String> emailArr = email.split("@");
    String firstPart = emailArr[0].substring(0, emailArr[0].length - 2);
    for (int i = 0; i < emailArr[0].length - 2; i++){
      censoredEmail.write("*");
    }
    censoredEmail.write(emailArr[0].substring(emailArr[0].length - 2, emailArr[0].length));
    censoredEmail.write("@${emailArr[1]}");

  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Park Pal',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        appBarTheme: AppBarTheme(color: HexColor("99dbFF")),
      ),
      home: Scaffold(
          appBar: AppBar(
            centerTitle: true,
            title: const Text('Verify your email'),
            titleTextStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 20, color: Colors.white),
          ),
          body: SingleChildScrollView(

          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              SizedBox(height: 50),
              Container(
                alignment: Alignment.center,
                width: double.infinity,

                height: 250,
                child: Center(
                  child: const Image(
                    image: AssetImage('assets/ParkPal.png'),
                  ),
                ),
              ),

          Container(
            padding: const EdgeInsets.all(10),
              height: 250,
              child:
              Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children:[

                  Center(
                      child:Container(
                      padding: const EdgeInsets.all(0),
                        decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.vertical(top: Radius.circular(25.0), bottom: Radius.circular(25.0), ),
                            boxShadow: [
                              BoxShadow(
                                offset: Offset(0.0, 1.0),
                                blurRadius: 10,
                              ),
                            ]
                        ),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [


                          Container(
                            padding: const EdgeInsets.only(top: 20, left: 5, right: 5, bottom: 0),
                            child: Center(
                                child: Wrap(
                                      children: [
                                        Text("Your email on file: $censoredEmail", style: TextStyle(color: Colors.black, fontSize: 15)),
                                      ],
                                )
                            ),
                          ),
                          Container(
                            height: 100,
                            padding: const EdgeInsets.all(10),
                            child: Center(
                              child: Icon(
                                size: 100,
                                Icons.email
                              ),
                            ),
                          ),
                          Container(
                            alignment: Alignment.center,
                            width: double.infinity,
                            padding: const EdgeInsets.all(8),
                            // request code to email
                            child: MaterialButton(
                              onPressed: () {
                                sendEmail("", email, "Confirm your email for Park Pal", "Your one time code is $testVal");
                                showDialog(
                                    context: context,
                                    builder: (BuildContext context) {
                                      return AlertDialog(
                                        scrollable: true,
                                        content: Column(
                                          mainAxisAlignment: MainAxisAlignment.center,
                                          children: [
                                            SizedBox(height: 30),
                                            SizedBox(
                                              height: 40,
                                              child: Text("Enter code", style: TextStyle(fontSize: 30),),
                                            ),
                                            SizedBox(height: 20),
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
                                      );
                                    }
                                );
                              },
                              color: HexColor("#99dbFF"),
                            child: const Text('Send verification email', style: TextStyle(color: Colors.black)),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ]
            )
          ),],),
      ),),
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
  String _passwordErrorText = "";

  TextEditingController _newPasswordController = TextEditingController();
  String newPassword = "";
  String newPassword2 = "";
  TextEditingController _newPasswordController2 = TextEditingController();

  bool _validatePass = false;
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
        appBarTheme: AppBarTheme(color: HexColor("99dbFF")),
      ),
      home: Scaffold(
        appBar: AppBar(
          centerTitle: true,
          title: const Text('Park Pal'),
          titleTextStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 20, color: Colors.white),
        ),
        body: Container(
          padding: const EdgeInsets.all(8),
            child: Center(
              child:SingleChildScrollView(
            child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                  child: Column(
                    children: [
                      SizedBox(height: 15),
                      const FittedBox(
                        fit: BoxFit.scaleDown,
                        child: Text(
                          "Reset your password",
                          style: TextStyle(fontSize: 30),
                        ),
                      ),
                   
                      // create text fields for user to input their passwords, one for new and one to confirm the new password
                      Container(
                        padding: const EdgeInsets.all(15),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            SizedBox(height: 10),
                            TextField(
                              obscureText: true,
                              controller: _newPasswordController,
                              decoration: InputDecoration(
                                  hintText: "New Password",
                                  border: OutlineInputBorder(),
                                  errorText: (_passwordErrorText.isEmpty) ? null : _passwordErrorText,
                                  suffixIcon: IconButton(
                                    onPressed: (){
                                      _newPasswordController.clear();
                                    },
                                    icon: const Icon(Icons.clear),
                                  )
                              ),
                            ),
                            SizedBox(height: 15),
                            TextField(
                              obscureText: true,
                              controller: _newPasswordController2,
                              decoration: InputDecoration(
                                  hintText: "Confirm New Password",
                                  border: OutlineInputBorder(),
                                  errorText: _newPasswordController.text != _newPasswordController2.text ? "Please enter matching passwords" : null,
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
                            _validatePass = !checkPassword(_newPasswordController.text);
                            if (checkPassword(newPassword) && newPassword2.isNotEmpty && newPassword.isNotEmpty && newPassword == newPassword2){
                              _validatePasswords = true;
                            }
                            // if the passwords don't match, show the error message about matching passwords
                            else if (newPassword != newPassword2) {
                              _validatePasswords = false;
                            }

                            // send the user back to the login page when password is reset
                            if (_validatePasswords && checkPassword(newPassword)){
                              completeReset(username, newPassword);
                              Navigator.push(context, MaterialPageRoute(builder: (context) => const MyApp()));
                            }
                          });
                        },
                        child: const Text('Reset', style: TextStyle(color: Colors.black)),
                        color: HexColor("99dbFF"),
                        ),
                      ],
                   ),
                  ),
                ],
                ),
              ),
            ),
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

  bool checkPassword(String password){
    _passwordErrorText = '';

    if (password.length < 8){

      setState(() {
        _passwordErrorText += '• Password must be at least 8 characters.\n';
        _validatePass = true;
      });
    }
    if (!password.contains(RegExp(r'[A-Z]'))){
      setState(() {
        _validatePass = true;

        _passwordErrorText += '• Password must contain an uppercase letter.\n';
      });
    }
    if (!password.contains(RegExp(r'[a-z]'))){
      setState(() {
        _validatePass = true;

        _passwordErrorText += '• Password must contain a lowercase letter.\n';
      });
    }
    if (!password.contains(RegExp(r'[0-9]'))){
      setState(() {
        _validatePass = true;

        _passwordErrorText += '• Password must contain a number.\n';
      });
    }
    if (!password.contains(RegExp(r'[!@#%^&*(),.?":{}|<>]'))) {
      setState(() {
        _validatePass = true;
        _passwordErrorText += '• Password must contain a special character.\n';
      });
    }


    return _passwordErrorText.isEmpty;
  }
}


