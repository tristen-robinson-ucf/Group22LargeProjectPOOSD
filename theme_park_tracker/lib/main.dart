import 'dart:convert';
import 'dart:ffi';
import 'dart:async';
import 'dart:io';

import 'package:flutter/cupertino.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter/widgets.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:mongo_dart/mongo_dart.dart' as mongo;
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

void main() {
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
                              ..onTap = () => Navigator.push(context, MaterialPageRoute(builder: (context) => const _registerLauncher())),
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
  List<int> parkArr = [64, 6];


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

                  SavedParks(parkArr: parkArr),
                  PlannedTrips(),
                ])
              ),
            ],

          ),
        ),
        // appBar: AppBar(
        //   centerTitle: true,
        //   title: const Text('Landing Page'),
        //   titleTextStyle: TextStyle(fontWeight: FontWeight.bold, fontSize: 20, color: Colors.white),
        // ),
        // body: const SingleChildScrollView(
        //   padding: EdgeInsets.all(8),
        //   child: Column(
        //     mainAxisAlignment: MainAxisAlignment.center,
        //     children: [
        //       FittedBox(
        //         fit: BoxFit.scaleDown,
        //         child: Text('Landing Page', style: TextStyle(fontSize: 30)),
        //       )
        //     ],
        //   )
        // )
      )
    );
  }

  Column savedParks(){
    return Column(

    );
  }

}



class _registerLauncher extends StatelessWidget{
  const _registerLauncher ({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: MyRegPage(),
    );
  }
}

class MyRegPage extends StatefulWidget {

  @override
  _registerPage createState() => _registerPage();
}

// page to handle registration
class _registerPage extends State<MyRegPage>{
  final firstName_controller = TextEditingController();
  final lastName_controller = TextEditingController();
  final username_controller = TextEditingController();
  final password_controller = TextEditingController();
  final email_controller = TextEditingController();
  final phone_controller = TextEditingController();

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


  @override
  Widget build(BuildContext context) {
    const String appTitle = 'Theme Park Time Tracker';
    TextStyle defaultStyle = TextStyle(color: Colors.grey, fontSize: 20.0);
    TextStyle linkStyle = TextStyle(color: Colors.blue);
    return MaterialApp(
      theme: ThemeData(
          primarySwatch: Colors.blue,
          appBarTheme: AppBarTheme(
            color: Colors.indigo,
          )
      ),
      home: Scaffold(
          resizeToAvoidBottomInset: false,
          appBar: AppBar(
            centerTitle: true,
            title: const Text('Theme Park Time Tracker'),
            titleTextStyle: TextStyle(fontWeight: FontWeight.bold, fontSize: 20, color: Colors.white),

          ),
          body: SingleChildScrollView(
              padding: EdgeInsets.all(20.0),
              child: Column(
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
                        controller: firstName_controller,
                        decoration: InputDecoration(
                            hintText: "First Name",
                            errorText: _validateFirst ? "Please enter a First Name" : null,
                            border: OutlineInputBorder(),
                            suffixIcon: IconButton(
                              onPressed: (){
                                firstName_controller.clear();
                              },
                              icon: const Icon(Icons.clear),
                            )
                        )
                    ),
                    SizedBox(height: 30),
                    TextField(
                        controller: lastName_controller,
                        decoration: InputDecoration(
                            hintText: "Last Name",
                            border: OutlineInputBorder(),
                            errorText: _validateLast ? "Please enter a Last Name" : null,
                            suffixIcon: IconButton(
                              onPressed: (){
                                lastName_controller.clear();
                              },
                              icon: const Icon(Icons.clear),
                            )
                        )
                    ),
                    SizedBox(height: 30),
                    TextField(
                      controller: phone_controller,
                      decoration: InputDecoration(
                        hintText: "Phone Number",
                        border: OutlineInputBorder(),
                        errorText: _validatePhone ? "Please enter a Phone Number" : null,
                        suffixIcon: IconButton(
                          onPressed: (){
                            phone_controller.clear();
                          },
                          icon: const Icon(Icons.clear),
                        ),
                      ),
                    ),
                    SizedBox(height: 30),
                    TextField(
                      controller: email_controller,
                      decoration: InputDecoration(
                        hintText: "Email",
                        border: OutlineInputBorder(),
                        errorText: _validateEmail ? "Please enter an Email" : null,
                        suffixIcon: IconButton(
                          onPressed: (){
                            email_controller.clear();
                          },
                          icon: const Icon(Icons.clear),
                        ),
                      ),
                    ),
                    SizedBox(height: 30),
                    TextField(
                        controller: username_controller,
                        decoration: InputDecoration(
                            hintText: "Username",
                            border: OutlineInputBorder(),
                            errorText: _validateUser ? "Please enter a Username" : null,

                            suffixIcon: IconButton(
                              onPressed: (){
                                username_controller.clear();
                              },
                              icon: const Icon(Icons.clear),
                            )
                        )
                    ),
                    // if the user selects the button, populate the username with that users email
                    MaterialButton(
                        onPressed: () {
                          username_controller.text = email_controller.text;
                        },
                        color: Colors.grey,
                        child: const Align(
                          child: Text('Use Email', style: TextStyle(color: Colors.white)),
                          alignment: Alignment.topLeft,
                        )
                    ),
                    SizedBox(height: 30),
                    TextField(
                      controller: password_controller,
                      obscureText: true,
                      decoration: InputDecoration(
                        hintText: "Password",
                        border: OutlineInputBorder(),
                        errorText: _validatePass ? "Please enter a Password" : null,
                        suffixIcon: IconButton(
                          onPressed: (){
                            password_controller.clear();
                          },
                          icon: const Icon(Icons.clear),
                        ),
                      ),
                    ),
                    SizedBox(height: 30),
                    MaterialButton(
                      onPressed: () {
                        user = username_controller.text;
                        password = password_controller.text;
                        firstName = firstName_controller.text;
                        lastName = lastName_controller.text;
                        email = email_controller.text;
                        phone = phone_controller.text;

                        // update validate vars to reflect copleteness of the fields,
                        // turn on error text if any are empty, if not go through with registration
                        setState(() {
                          _validateUser = user.isEmpty;
                          _validatePass = password.isEmpty;
                          _validateEmail = email.isEmpty;
                          _validatePhone = phone.isEmpty;
                          _validateFirst = firstName.isEmpty;
                          _validateLast = lastName.isEmpty;
                        });


                        if (!_validateLast && !_validateFirst && !_validatePhone && !_validateEmail && !_validateUser && !_validatePass){
                          Fluttertoast.showToast(msg: 'Registering...');
                        }


                      },
                      color: Colors.blueAccent,
                      child: const Text('Register', style: TextStyle(color: Colors.white)),
                    ),
                  ]
              )
          )
      ),
    );
  }
}






// class HomePageState extends State<HomePage>{
//   @override
//   Widget build(BuildContext context) {
//     home: Scaffold(
//       appBar: AppBar(
//           title: Text('Theme Park Time Tracker'),
//           centerTitle: true
//       ),
//       body: Padding(
//           padding: const EdgeInsets.all(20.0),
//           child: TextField(decoration: InputDecoration(
//             hintText: "Username",
//             border: OutlineInputBorder(),
//           )),
//       );
//   }
// }
//           // child: TextField(decoration: InputDecoration(
//           //   mainAxisAlignment: MainAxisAlignment.center,
//           //   hintText: "Username",
//           //   border: OutlineInputBorder(),
//           // ))
//       ),
//       // floatingActionButton: FloatingActionButton(
//       //   onPressed: () {    },
//       //   child: Text('Register'),
//       // ),
//     );
//   }
// }

// class MyApp extends StatelessWidget {
//   const MyApp({super.key});
//
//   // This widget is the root of your application.
//   @override
//   Widget build(BuildContext context) {
//     return MaterialApp(
//       title: 'Flutter Demo',
//       theme: ThemeData(
//         // This is the theme of your application.
//         //
//         // TRY THIS: Try running your application with "flutter run". You'll see
//         // the application has a purple toolbar. Then, without quitting the app,
//         // try changing the seedColor in the colorScheme below to Colors.green
//         // and then invoke "hot reload" (save your changes or press the "hot
//         // reload" button in a Flutter-supported IDE, or press "r" if you used
//         // the command line to start the app).
//         //
//         // Notice that the counter didn't reset back to zero; the application
//         // state is not lost during the reload. To reset the state, use hot
//         // restart instead.
//         //
//         // This works for code too, not just values: Most code changes can be
//         // tested with just a hot reload.
//         colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
//         useMaterial3: true,
//       ),
//       home: const MyHomePage(title: 'Theme Park Traveler'),
//     );
//   }
// }
//
// class MyHomePage extends StatefulWidget {
//   const MyHomePage({super.key, required this.title});
//
//   // This widget is the home page of your application. It is stateful, meaning
//   // that it has a State object (defined below) that contains fields that affect
//   // how it looks.
//
//   // This class is the configuration for the state. It holds the values (in this
//   // case the title) provided by the parent (in this case the App widget) and
//   // used by the build method of the State. Fields in a Widget subclass are
//   // always marked "final".
//
//   final String title;
//
//   @override
//   State<MyHomePage> createState() => _MyHomePageState();
// }
//
// class _MyHomePageState extends State<MyHomePage> {
//   int _counter = 0;
//
//   void _incrementCounter() {
//     setState(() {
//       // This call to setState tells the Flutter framework that something has
//       // changed in this State, which causes it to rerun the build method below
//       // so that the display can reflect the updated values. If we changed
//       // _counter without calling setState(), then the build method would not be
//       // called again, and so nothing would appear to happen.
//       _counter++;
//     });
//   }
//
//   @override
//   Widget build(BuildContext context) {
//     // This method is rerun every time setState is called, for instance as done
//     // by the _incrementCounter method above.
//     //
//     // The Flutter framework has been optimized to make rerunning build methods
//     // fast, so that you can just rebuild anything that needs updating rather
//     // than having to individually change instances of widgets.
//     return Scaffold(
//       appBar: AppBar(
//         // TRY THIS: Try changing the color here to a specific color (to
//         // Colors.amber, perhaps?) and trigger a hot reload to see the AppBar
//         // change color while the other colors stay the same.
//         backgroundColor: Theme.of(context).colorScheme.inversePrimary,
//         // Here we take the value from the MyHomePage object that was created by
//         // the App.build method, and use it to set our appbar title.
//         title: Text(widget.title),
//       ),
//       body: Center(
//         // Center is a layout widget. It takes a single child and positions it
//         // in the middle of the parent.
//         child: Column(
//           // Column is also a layout widget. It takes a list of children and
//           // arranges them vertically. By default, it sizes itself to fit its
//           // children horizontally, and tries to be as tall as its parent.
//           //
//           // Column has various properties to control how it sizes itself and
//           // how it positions its children. Here we use mainAxisAlignment to
//           // center the children vertically; the main axis here is the vertical
//           // axis because Columns are vertical (the cross axis would be
//           // horizontal).
//           //
//           // TRY THIS: Invoke "debug painting" (choose the "Toggle Debug Paint"
//           // action in the IDE, or press "p" in the console), to see the
//           // wireframe for each widget.
//           mainAxisAlignment: MainAxisAlignment.center,
//           children: <Widget>[
//             const Text(
//               'You have pushed the button this many times:',
//             ),
//             Text(
//               '$_counter',
//               style: Theme.of(context).textTheme.headlineMedium,
//             ),
//           ],
//         ),
//       ),
//       floatingActionButton: FloatingActionButton(
//         onPressed: _incrementCounter,
//         tooltip: 'Increment',
//         child: const Icon(Icons.add),
//       ), // This trailing comma makes auto-formatting nicer for build methods.
//     );
//   }
// }
