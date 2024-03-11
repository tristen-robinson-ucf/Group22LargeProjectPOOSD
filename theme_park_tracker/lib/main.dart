import 'dart:convert';
import 'dart:ffi';
import 'dart:async';
import 'dart:io';
import 'dart:math';

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
  final String error;

  const User({
    required this.id,
    required this.firstname,
    required this.lastname,
    required this.error,

  });

  factory User.fromJson(Map<String, dynamic> json) {
    return switch (json) {
      {
      'id': int id,
      'firstname': String firstname,
      'lastname': String lastname,
      'error' : String error,
      } =>
          User(
            id: id,
            firstname: firstname,
            lastname: lastname,
            error: error,
          ),
      _ => throw const FormatException('Failed to load User.'),
    };
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
      title: 'Theme Park Time Tracker',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        appBarTheme: const AppBarTheme(color: Colors.indigo),
      ),
      home: Scaffold(
        appBar: AppBar(
          centerTitle: true,
          title: const Text('ThemeParkTimeTracker'),
          titleTextStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 20, color: Colors.white),
        ),
        body: SingleChildScrollView(
          child: Container(
            alignment: Alignment.center,
            padding: const EdgeInsets.all(8),

            child: (_futureUser == null) ? buildColumn() : buildFutureBuilder(),
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
        children: <Widget>[
          const FittedBox(
            fit: BoxFit.scaleDown,
            child: Text(
              "Login",
              style: TextStyle(fontSize: 30),
            ),
          ),
          SizedBox(height: 30),
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
                      )
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
                  SizedBox(height: 60),
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
                      ))
                ]
            ),
          )
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
              Navigator.push(context, MaterialPageRoute( builder: (context) => _landingPage(firstName: snapshot.data!.firstname, lastName: snapshot.data!.lastname, id: snapshot.data!.id)));
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

class _landingPage extends StatelessWidget {
  String firstName, lastName;
  int id;
  List<int> parkArr = [64, 6, 65, 8];


  _landingPage({required this.firstName, required this.lastName, required this.id});


  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        title: 'Landing Page',
        theme: ThemeData(
          appBarTheme: const AppBarTheme(color: Colors.indigo),
          colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
          tabBarTheme: const TabBarTheme(dividerColor: Colors.black, indicatorColor: Colors.indigo, labelColor: Colors.indigo, unselectedLabelColor: Colors.grey),
    ),
      home: DefaultTabController(
        length: 2,
        child: Scaffold(
          appBar: AppBar(
              centerTitle: true,
              title: Text("Welcome " + firstName),
              titleTextStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 20, color: Colors.white),
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

                  SavedParks(parkArr: parkArr, id: id),
                  PlannedTrips(),
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
      title: "Theme Park Time Tracker",
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        appBarTheme: const AppBarTheme(color: Colors.indigo),
      ),
      home: Scaffold(
          appBar: AppBar(
            centerTitle: true,
            title: const Text('ThemeParkTimeTracker'),
            titleTextStyle: const TextStyle(
                fontWeight: FontWeight.bold, fontSize: 20, color: Colors.white),
          ),
          body: SingleChildScrollView(
            child: Container(
              alignment: Alignment.center,
              padding: const EdgeInsets.all(8),

              child: (_futureUser == null)
                  ? buildColumn()
                  : buildFutureBuilder(email),
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
          const FittedBox(
            fit: BoxFit.scaleDown,
            child: Text(
              "Register",
              style: TextStyle(fontSize: 30),
            ),
          ),
          SizedBox(height: 30),
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
          SizedBox(height: 30),
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
          SizedBox(height: 30),
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
          SizedBox(height: 30),
          TextField(
            controller: _emailController,
            decoration: InputDecoration(
              hintText: "Email",
              border: OutlineInputBorder(),
              errorText: _validateEmail ? "Please enter an Email" : null,
              suffixIcon: IconButton(
                onPressed: (){
                  _emailController.clear();
                },
                icon: const Icon(Icons.clear),
              ),
            ),
          ),
          SizedBox(height: 30),
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
          MaterialButton(
              onPressed: () {
                _usernameController.text = _emailController.text;
              },
              color: Colors.grey,
              child: const Align(
                child: Text('Use Email', style: TextStyle(color: Colors.white)),
                alignment: Alignment.topLeft,
              )
          ),
          SizedBox(height: 30),
          TextField(
            controller: _passwordController,
            obscureText: true,
            decoration: InputDecoration(
              hintText: "Password",
              border: OutlineInputBorder(),
              errorText: _validatePass ? "Please enter a Password" : null,
              suffixIcon: IconButton(
                onPressed: (){
                  _passwordController.clear();
                },
                icon: const Icon(Icons.clear),
              ),
            ),
          ),
          SizedBox(height: 30),
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
                _validatePass = password.isEmpty;
                _validateEmail = email.isEmpty;
                _validatePhone = phone.isEmpty;
                _validateFirst = firstName.isEmpty;
                _validateLast = lastName.isEmpty;

                if (!_validatePass && !_validateUser) {
                  _futureUser = registerUser(
                    firstName,
                    lastName,
                    email,
                    phone,
                    user,
                    password,);
                };
              });


              if (!_validateLast && !_validateFirst && !_validatePhone && !_validateEmail && !_validateUser && !_validatePass){
                Fluttertoast.showToast(msg: 'Registering...');
              }


            },
            color: Colors.blueAccent,
            child: const Text('Register', style: TextStyle(color: Colors.white)),

          )
        ]
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
                  verifyEmailScreen(firstName: snapshot.data!.firstname,
                      email: email,
                      lastName: snapshot.data!.lastname,
                      id: snapshot.data!.id)));
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

class verifyEmailScreen extends StatefulWidget {
  String firstName;
  String lastName;
  String email;
  int id;
  verifyEmailScreen({super.key, required this.firstName, required this.lastName, required this.email, required this.id});

  @override
  State<verifyEmailScreen> createState() => _VerifyEmailScreen();

}

// screen to verify the email the user used to register
class _VerifyEmailScreen extends State<verifyEmailScreen>{
  late String firstName;
  late String lastName;
  late String email;
  late int id;

  TextEditingController _codeController = TextEditingController();

  Random random = Random();
  int testVal = 0;



  @override
  void initState(){
    super.initState();
    firstName = widget.firstName;
    lastName = widget.lastName;
    email = widget.email;
    id = widget.id;
    testVal = random.nextInt(90000) + 10000;

  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Theme Park Time Tracker',
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
                      sendEmail(firstName, email, "Confirm your email for Theme Park Time Tracker", "Your one time code is $testVal");
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
                              Navigator.push( context, MaterialPageRoute( builder: (context) => _landingPage(firstName: firstName, lastName: lastName, id: id))
                              );
                            } else{
                              Fluttertoast.showToast(msg: "Incorrect code, try again or request another");
                            }
                          },
                        color: Colors.blueAccent,
                        child: const Text('Register', style: TextStyle(color: Colors.white)),

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
    Fluttertoast.showToast(msg: "Success");
  }
  else{
    Fluttertoast.showToast(msg: "Could not verify");
  }
}


