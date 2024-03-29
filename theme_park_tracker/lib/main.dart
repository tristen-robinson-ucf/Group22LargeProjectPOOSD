import 'dart:convert';
import 'dart:ffi';
import 'dart:async';
import 'dart:io';
import 'dart:math';

import 'package:email_validator/email_validator.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter/widgets.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:hexcolor/hexcolor.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:mongo_dart/mongo_dart.dart' as mongo;
import 'package:theme_park_tracker/PasswordReset.dart';
import 'package:theme_park_tracker/register.dart';
import 'package:theme_park_tracker/tabs/PlannedTrips.dart';
import 'package:theme_park_tracker/tabs/SavedParks.dart';

Future<User> authenticateUser(String username, String password) async {
  final response = await http.post(
    Uri.parse('https://group-22-0b4387ea5ed6.herokuapp.com/api/login'),
    headers: <String, String>{
      'Content-Type': 'application/json',
    },
    body: jsonEncode(<String, String>{
      'username': username.trim(),
      'password': password.trim(),
    }),
  );

  if (response.statusCode == 200) {
    return User.fromJson(jsonDecode(response.body) as Map<String, dynamic>);
  }
  else {
    throw Exception('Failed to create user.');
  }
}

class User {
  final int id;
  final String firstname;
  final String lastname;
  final List<int> saved_parks;
  final String error;

  const User({
    required this.id,
    required this.firstname,
    required this.lastname,
    required this.saved_parks,
    required this.error,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    if (json.containsKey('id') &&
        json.containsKey('firstname') &&
        json.containsKey('lastname') &&
        json.containsKey('saved_parks') &&
        json.containsKey('error')) {
      return User(
        id: json['id'],
        firstname: json['firstname'],
        lastname: json['lastname'],
        saved_parks: List<int>.from(json['saved_parks']),
        error: json['error'],
      );
    } else {
      throw FormatException('Failed to load User.');
    }
  }
}

void main() async {
  // WidgetsBinding widgetsBinding = WidgetsFlutterBinding.ensureInitialized();
  // await Firebase.initializeApp();
  runApp(const MaterialApp(
    home: MyApp(),
    ),
  );
}

class MyApp extends StatefulWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  State<MyApp> createState() {
    return _MyAppState();
  }
}

class _MyAppState extends State<MyApp> {
  TextEditingController _usernameController = TextEditingController();
  TextEditingController _passwordController = TextEditingController();

  String user = "";
  String password = "";

  bool _validateUser = false;
  bool _validatePass = false;

  Future<User>? _futureUser;


  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Park Pal',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        appBarTheme: const AppBarTheme(color: Colors.indigo),
      ),
      home: Scaffold(

        body:  Container(
            decoration: BoxDecoration(
              color: HexColor("#99dbFF")
            ),
            alignment: Alignment.center,
            padding: const EdgeInsets.all(8),

            child: SingleChildScrollView(
              child:  (_futureUser == null) ? buildColumn() : buildFutureBuilder(),
            ),
          ),
        ),

   );
  }
  Column buildColumn() {
    TextStyle defaultStyle = TextStyle(color: Colors.grey, fontSize: 18.0);
    TextStyle linkStyle = TextStyle(color: Colors.blue, fontSize: 18.0);
    return Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: <Widget>[

          Container(
            height: 200,
            child: Center(
              child: const Image(
                image: AssetImage('assets/ParkPal.png'),
              ),
            ),
          ),

          // create container to hold login text fields, and another to ensure spacing between fields and the border
          Container(
            decoration: BoxDecoration(
                color: Colors.white,
                border: Border.all(width: 6, color: Colors.black),
            ),
            child: Container(
              padding: const EdgeInsets.all(15),

              child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  SizedBox(height: 15),
                  const FittedBox(
                    fit: BoxFit.scaleDown,
                    child: Text(
                      "Login",
                      style: TextStyle(fontSize: 30),
                    ),
                  ),
                  SizedBox(height: 15),
                  Container(
                    padding: const EdgeInsets.all(8.0),
                    child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          TextField(
                              controller: _usernameController,
                              decoration: InputDecoration(
                                  hintText: "Username",
                                  border: OutlineInputBorder(),
                                  errorText: _validateUser ? "Please enter a Username" : null,
                                  suffixIcon: IconButton(
                                    onPressed: () {
                                      _usernameController.clear();
                                    },
                                    icon: const Icon(Icons.clear),
                                  )
                              )
                          ),
                          SizedBox(height: 30),
                          Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              TextField(
                                obscureText: true,
                                controller: _passwordController,
                                decoration: InputDecoration(
                                    hintText: "Password",
                                    border: OutlineInputBorder(),
                                    errorText: _validatePass ? "Please enter a Password" : null,
                                    suffixIcon: IconButton(
                                      onPressed: () {
                                        _passwordController.clear();
                                      },
                                      icon: const Icon(Icons.clear),
                                    )
                                ),
                              ),
                              Container(
                                alignment: Alignment.centerRight,
                                child:
                                RichText(
                                  text: TextSpan(
                                    text: "Forgot password?",
                                    style: linkStyle,
                                    recognizer: TapGestureRecognizer()
                                      ..onTap = () => Navigator.push(context, MaterialPageRoute(builder: (context) => const PasswordReset())),
                                  ),
                                ),
                              ),
                            ],

                          ),
                          SizedBox(height: 30),
                          MaterialButton(
                            onPressed: () {
                              user = _usernameController.text;
                              password = _passwordController.text;


                              setState(() {
                                _validateUser = user.isEmpty;
                                _validatePass = password.isEmpty;

                                if (!_validatePass && !_validateUser) {
                                  _futureUser = authenticateUser(
                                      _usernameController.text,
                                      _passwordController.text);
                                };
                              });
                            },
                            color: Colors.blueAccent,
                            child: const Text('Login', style: TextStyle(color: Colors.white)),
                          ),
                        ],
                    ),
                  ),
                  SizedBox(height: 15),
                  RichText(
                      text: TextSpan(
                          style: defaultStyle,
                          children: <TextSpan>[
                            TextSpan(text: "Don't have an account? "),
                            TextSpan(
                              text: 'Register here.',
                              style: linkStyle,
                              recognizer: TapGestureRecognizer()
                                ..onTap = () => Navigator.push(context, MaterialPageRoute(builder: (context) => const MyRegPage())),
                            )
                          ]
                      )
                  ),
                ],
              ),
            ),
          ),


        ]
    );
  }

  FutureBuilder<User> buildFutureBuilder() {
    return FutureBuilder<User>(
      future: _futureUser,
      builder: (context, snapshot) {
        if (snapshot.hasData && snapshot.data!.id != -1) {
          Fluttertoast.showToast(msg: 'Welcome ${snapshot.data!.firstname}, logging you in.');
          final user = snapshot.data;
          if (user?.id != -1){
            SchedulerBinding.instance.addPostFrameCallback((_) {
              Navigator.push(context, MaterialPageRoute( builder: (context) => LandingPage(firstname: snapshot.data!.firstname, lastname: snapshot.data!.lastname, id: snapshot.data!.id, parkArr: snapshot.data!.saved_parks)));
            });
            return Container();

            //Navigator.push( context, MaterialPageRoute( builder: (context) => _landingPage(firstName: user!.firstname, lastName: user!.lastname, id: user!.id)));
          }
          else {
            return Text('Cannot login right now.');
          }
          return Container();
        } else if (snapshot.hasError) {
          return Text('${snapshot.error}');
        } else if (snapshot.hasData && snapshot.data!.id == -1){
          Fluttertoast.showToast(msg: "Username/Password combination incorrect");
          return buildColumn();
        }

        return const CircularProgressIndicator();
      },
    );
  }
}
class LandingPage extends StatefulWidget{
  String firstname, lastname;
  int id;
  List<int> parkArr;
  LandingPage({super.key, required this.id, required this.parkArr, required this.firstname, required this.lastname});

  @override
  State<LandingPage> createState() => _landingPage();
}

class _landingPage extends State<LandingPage> {
  late String firstname, lastname;
  late int id;
  late List<int> parkArr;

  @override
  void initState() {
    parkArr = widget.parkArr;
    id = widget.id;
    firstname = widget.firstname;
    lastname = widget.lastname;
    super.initState();

  }


  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        title: 'Landing Page',
        theme: ThemeData(
          appBarTheme: AppBarTheme(color: HexColor("#EB5756")),
          colorScheme: ColorScheme.fromSeed(seedColor:HexColor("#EB5756")),
          tabBarTheme: TabBarTheme(dividerColor: Colors.black, indicatorColor: HexColor("Eb7978"), labelColor:HexColor("Eb7978"), unselectedLabelColor: Colors.grey),
    ),
      // create two tabs to let users switch between the saved parks and their planned days
      home: DefaultTabController(
        length: 2,
        child: Scaffold(
          appBar: AppBar(
              centerTitle: true,
              title: Text("Park Pal"),
              titleTextStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 20, color: Colors.white),
              actions: [
                // add a button to allow the user to logout
                IconButton(
                    onPressed: (){
                      Navigator.push(context, MaterialPageRoute(builder: (context) => MyApp()));
                    },
                    icon: const Icon(Icons.logout, color: Colors.white),

                ),
              ],
          ),
          body: Column(
            children: [
              const TabBar(
                  tabs: [
                    Tab(text: "Saved Parks"),
                    Tab(text: "Planned Trips"),
                  ],
              ),
              Expanded(
                child: TabBarView(children: [

                  SavedParks(parkArr: parkArr, id: id, firstname: firstname, lastname: lastname),
                  PlannedTrips(parkArr: parkArr, id: id, firstname: firstname, lastname: lastname),
                ])
              ),
            ],

          ),
        ),
      )
    );
  }

  Column savedParks(){
    return Column(

    );
  }

}

class MyRegPage extends StatefulWidget {
  const MyRegPage({super.key});

  @override
  State<MyRegPage> createState() => _registerPage();
}

Future<User> registerUser(String firstName, String lastName, String email, String phone, String username, String password) async {
  final response = await http.post(
    Uri.parse('https://group-22-0b4387ea5ed6.herokuapp.com/api/register'),
    headers: <String, String>{
      'Content-Type': 'application/json',
    },
    body: jsonEncode(<String, String>{
      'firstname': firstName.trim(),
      'lastname': lastName.trim(),
      'email' : email.trim(),
      'phone' : phone.trim(),
      'username': username.trim(),
      'password': password.trim(),
    }),
  );

  if (response.statusCode == 200) {
    // if user is registered, then call the login api and log the user in automatically
    final responseLog = await http.post(
      Uri.parse('https://group-22-0b4387ea5ed6.herokuapp.com/api/login'),
      headers: <String, String>{
        'Content-Type': 'application/json',
      },
      body: jsonEncode(<String, String>{
        'username': username.trim(),
        'password': password.trim(),
      }),
    );
    return User.fromJson(jsonDecode(responseLog.body) as Map<String, dynamic>);
  }
  else {
    throw Exception('Failed to register.');
  }
}

// page to handle registration
class _registerPage extends State<MyRegPage> {
  final _firstnameController = TextEditingController();
  final _lastnameController = TextEditingController();
  final _usernameController = TextEditingController();
  final _passwordController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();

  String _emailErrorText = "";
  String _passwordErrorText = "";
  String user = "";
  String password = "";
  String firstName = "";
  String lastName = "";
  String phone = "";
  String email = "";

  bool _validateFirst = false;
  bool _validateLast = false;
  bool _validateEmail = false;
  bool _validatePhone = false;
  bool _validateUser = false;
  bool _validatePass = false;

  Future<User>? _futureUser;

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: "Park Pal",
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        appBarTheme: const AppBarTheme(color: Colors.indigo),
      ),
      home: Scaffold(
          body: Container(
            alignment: Alignment.center,
            padding: const EdgeInsets.all(15),
            decoration: BoxDecoration(
              color: HexColor("#Fb9c7E"),
            ),
            child: SingleChildScrollView(
              child: buildColumn(),
            ),
          )

      ),
    );
  }

  Column buildColumn() {
    TextStyle defaultStyle = TextStyle(color: Colors.grey, fontSize: 20.0);
    TextStyle linkStyle = TextStyle(color: Colors.blue);
    return Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          SizedBox(height: 20),
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: Colors.white,
              border: Border.all(width: 4, color: Colors.black),
            ),
          child: Container(
            padding: const EdgeInsets.all(15),
            child: Column(
            children: [


                  Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const FittedBox(
                          fit: BoxFit.scaleDown,
                          child: Text(
                            "Register",
                            style: TextStyle(fontSize: 30),
                          ),
                        ),
                        SizedBox(height: 15),
                        TextField(
                            controller: _firstnameController,
                            decoration: InputDecoration(
                                hintText: "First Name",
                                errorText: _validateFirst ? "Please enter a First Name" : null,
                                border: OutlineInputBorder(),
                                suffixIcon: IconButton(
                                  onPressed: (){
                                    _firstnameController.clear();
                                  },
                                  icon: const Icon(Icons.clear),
                                )
                            )
                        ),
                        SizedBox(height: 15),
                        TextField(
                            controller: _lastnameController,
                            decoration: InputDecoration(
                                hintText: "Last Name",
                                border: OutlineInputBorder(),
                                errorText: _validateLast ? "Please enter a Last Name" : null,
                                suffixIcon: IconButton(
                                  onPressed: (){
                                    _lastnameController.clear();
                                  },
                                  icon: const Icon(Icons.clear),
                                )
                            )
                        ),
                        SizedBox(height: 15),
                        TextField(
                          controller: _phoneController,
                          decoration: InputDecoration(
                            hintText: "Phone Number",
                            border: OutlineInputBorder(),
                            errorText: _validatePhone ? "Please enter a Phone Number" : null,
                            suffixIcon: IconButton(
                              onPressed: (){
                                _phoneController.clear();
                              },
                              icon: const Icon(Icons.clear),
                            ),
                          ),
                        ),
                        SizedBox(height: 15),
                        TextField(
                          controller: _emailController,
                          decoration: InputDecoration(
                            hintText: "Email",
                            border: OutlineInputBorder(),
                            errorText: (_emailErrorText == "") ? null : _emailErrorText,
                            suffixIcon: IconButton(
                              onPressed: (){
                                _emailController.clear();
                              },
                              icon: const Icon(Icons.clear),
                            ),
                          ),
                          onChanged: (value) => updateUsername(),
                        ),
                        SizedBox(height: 15),
                        TextField(
                            controller: _usernameController,
                            decoration: InputDecoration(
                                hintText: "Username",
                                border: OutlineInputBorder(),
                                errorText: _validateUser ? "Please enter a Username" : null,

                                suffixIcon: IconButton(
                                  onPressed: (){
                                    _usernameController.clear();
                                  },
                                  icon: const Icon(Icons.clear),
                                )
                            )
                        ),
                        // if the user selects the button, populate the username with that users email

                        SizedBox(height: 15),
                        TextField(
                          controller: _passwordController,
                          obscureText: true,
                          decoration: InputDecoration(
                            hintText: "Password",
                            border: OutlineInputBorder(),
                            errorText: (_passwordErrorText.isEmpty) ? null : _passwordErrorText,
                            suffixIcon: IconButton(
                              onPressed: (){
                                _passwordController.clear();
                              },
                              icon: const Icon(Icons.clear),
                            ),
                          ),
                        ),
                        SizedBox(height: 15),
                        MaterialButton(
                          onPressed: () {
                            user = _usernameController.text;
                            password = _passwordController.text;
                            firstName = _firstnameController.text;
                            lastName = _lastnameController.text;
                            email = _emailController.text;
                            phone = _phoneController.text;

                            // update validate vars to reflect completeness of the fields,
                            // turn on error text if any are empty, if not go through with registration
                            setState(() {
                              _validateUser = user.isEmpty;
                              _validatePhone = phone.isEmpty;
                              _validateFirst = firstName.isEmpty;
                              _validateLast = lastName.isEmpty;
                              _validateEmail = !checkEmail(email);
                              _validatePass = !checkPassword(password);

                              if (checkPassword(password) && !_validateUser && checkEmail(email) && !_validatePhone && !_validateFirst && !_validateLast) {
                                Navigator.push(context, MaterialPageRoute(builder: (context) => verifyEmailScreen(firstName: firstName, lastName: lastName, email: email, phone: phone, username: user, password: password)));
                              };
                            });

                          },
                          color: HexColor("#99dbFF"),
                          child: const Text('Register', style: TextStyle(color: Colors.black)),

                        )
                      ],
                  ),
              ],
            ),
          ),),
        ],
    );
  }

  String updateUsername(){
    setState(() {
      _usernameController.text = _emailController.text;
    });
    return _usernameController.text;
  }

  bool checkEmail(String email) {
    _emailErrorText = '';
    if (email.isEmpty){
      setState(() {
        _validateEmail = true;
        _emailErrorText += '• Email is required\n';
      });
    } if (!EmailValidator.validate(email)) {
      setState(() {
        _validateEmail = true;
        _emailErrorText = '• Enter a valid email address\n';
      });
    }
    return _emailErrorText.isEmpty;
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

class verifyEmailScreen extends StatefulWidget {
  String firstName;
  String lastName;
  String email;
  String username;
  String password;
  String phone;
  verifyEmailScreen({super.key, required this.firstName, required this.lastName, required this.email, required this.phone, required this.username, required this.password});

  @override
  State<verifyEmailScreen> createState() => _VerifyEmailScreen();

}

// screen to verify the email the user used to register
class _VerifyEmailScreen extends State<verifyEmailScreen>{
  late String firstName;
  late String lastName;
  late String email;
  late String username;
  late String password;
  late String phone;
  late int id;
  late List<int> parkArr;
  Future<User>? _futureUser;

  TextEditingController _codeController = TextEditingController();

  Random random = Random();
  int testVal = 0;



  @override
  void initState(){
    super.initState();
    firstName = widget.firstName;
    lastName = widget.lastName;
    email = widget.email;
    username = widget.username;
    phone = widget.phone;
    password = widget.password;
    testVal = random.nextInt(90000) + 10000;

  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: "Park Pal",
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        appBarTheme: const AppBarTheme(color: Colors.indigo),
      ),
      home: Scaffold(
          body: Container(
            alignment: Alignment.center,
            padding: const EdgeInsets.all(15),
            decoration: BoxDecoration(
              color: HexColor("#Fb9c7E"),
            ),

            child: SingleChildScrollView(

              child: (_futureUser == null)
              ? buildColumn()
              : buildFutureBuilder(email),
            ),
          )

      ),
    );
  }


  Column buildColumn(){
   return Column(
        children:[


          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
              border: Border.all(width: 3, color: Colors.black),
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  height: 100,
                  padding: const EdgeInsets.all(10),
                  child: Icon(
                    size: 100,
                    Icons.email
                  ),
                ),
                Padding(
                    padding: const EdgeInsets.all(10),
                  child: Center(
                    child: Text("Confirm your email to continue with your registration.", style: TextStyle(color: Colors.black, fontSize: 13) ),
                  )
                ),
                SizedBox(
                  width: 200,
                  height: 75,
                  child: Container(
                    alignment: Alignment.center,
                    padding: const EdgeInsets.all(10),
                    // request code to email
                    child: MaterialButton(
                      onPressed: () {
                        sendEmail(firstName, email, "Confirm your email for Park Pal", "Your one time code is $testVal");
                        showDialog(
                            context: context,
                            builder: (BuildContext context) {
                              // create a popup to prompt the user to enter a code, if the codes match register the user and send them to the landing page
                              return AlertDialog(
                                scrollable: true,
                                content: Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    SizedBox(height: 20),
                                    SizedBox(
                                        height: 40,
                                        child: Text("Enter code", style: TextStyle(fontSize: 30),),
                                    ),

                                    SizedBox(height: 20),
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
                                                setState(() {
                                                  _futureUser = registerUser(firstName, lastName, email, phone, username, password);
                                                });
                                                Navigator.pop(context);
                                              } else{
                                                Fluttertoast.showToast(msg: "Incorrect code, try again or request another");
                                              }
                                            },
                                            color: HexColor("#99dbFF"),
                                            child: const Text('Register', style: TextStyle(color: Colors.black)),

                                          )
                                        ],
                                      ),
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
                ),
              ],
            ),
          ),
      ],
   );
  }

  FutureBuilder<User> buildFutureBuilder(String email) {
    return FutureBuilder<User>(
      future: _futureUser,
      builder: (context, snapshot) {

        if (snapshot.hasData && snapshot.data!.id != -1) {
          Fluttertoast.showToast(
              msg: 'Welcome ${snapshot.data!.firstname}, registering you now.');
          final user = snapshot.data;
          if (user?.id != -1) {
            SchedulerBinding.instance.addPostFrameCallback((_) {
              Navigator.push(context, MaterialPageRoute(builder: (context) =>
                 LandingPage(id: snapshot.data!.id, firstname: snapshot.data!.firstname, lastname: snapshot.data!.lastname, parkArr: snapshot.data!.saved_parks)));
            });
            return Container();

            //Navigator.push( context, MaterialPageRoute( builder: (context) => _landingPage(firstName: user!.firstname, lastName: user!.lastname, id: user!.id)));
          }
          else {
            return Text('Cannot login right now.');
          }
          return Container();
        } else if (snapshot.hasError) {
          return Text('${snapshot.error}');
        } else if (snapshot.hasData && snapshot.data!.id == -1) {
          Fluttertoast.showToast(
              msg: "Unable to register");
          return buildColumn();
        }

        return const CircularProgressIndicator();
      },
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


