import 'dart:ffi';

import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';

void main() => runApp( MyApp());

class MyApp extends StatelessWidget {
  const MyApp ({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: MyHomePage(),
    );
  }
}

class MyHomePage extends StatefulWidget {

  @override
  _LoginPage createState() => _LoginPage();
}

class _LoginPage extends State<MyHomePage>{
  final username_controller = TextEditingController();
  final password_controller = TextEditingController();
  String user = "";
  String password = "";

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
          appBar: AppBar(
            centerTitle: true,
            title: const Text('Theme Park Time Tracker'),
            titleTextStyle: TextStyle(fontWeight: FontWeight.bold, fontSize: 20, color: Colors.white),

          ),
          // Make buttons for inputs, aligned in the center
          body: Padding(
              padding: EdgeInsets.all(20.0),
              child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    SizedBox(height: 30),
                    TextField(
                        controller: username_controller,
                        decoration: InputDecoration(
                            hintText: "Username",
                            border: OutlineInputBorder(),
                            suffixIcon: IconButton(
                              onPressed: (){
                                username_controller.clear();
                              },
                              icon: const Icon(Icons.clear),
                            )
                        )
                    ),
                    SizedBox(height: 30),
                    TextField(
                      controller: password_controller,
                      // obscure the text so User can only see the current letter being input and not the whole string
                      obscureText: true,
                      decoration: InputDecoration(
                        hintText: "Password",
                        border: OutlineInputBorder(),
                        suffixIcon: IconButton(
                          onPressed: (){
                            password_controller.clear();
                          },
                          icon: const Icon(Icons.clear),
                        ),
                      ),
                    ),
                    SizedBox(height: 30),
                    // store input and prompt user that they are being logged in
                    MaterialButton(
                      onPressed: () {
                        user = username_controller.text;
                        password = password_controller.text;
                        Fluttertoast.showToast(msg: 'Logging in...');

                      },
                      color: Colors.blueAccent,
                      child: const Text('Login', style: TextStyle(color: Colors.white)),
                    ),
                    // prompt the user to register if they do not have an account, move them to the register page
                    SizedBox(height: 60),
                    RichText(
                        text: TextSpan(
                            style: defaultStyle,
                            children: <TextSpan>[
                              TextSpan(text: "Don't have an account? "),
                              TextSpan (
                                text: 'Register here.',
                                style: linkStyle,
                                recognizer: TapGestureRecognizer()
                                  ..onTap = () => Navigator.push(context, MaterialPageRoute(builder: (context) => _registerPage())),
                              )
                            ]
                        )
                    )



                  ]
              )
          )
      ),
    );
  }
}

// page to handle registration
class _registerPage extends StatelessWidget{
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
                    SizedBox(height: 30),
                    TextField(
                        controller: firstName_controller,
                        decoration: InputDecoration(
                            hintText: "First Name",
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

                        Fluttertoast.showToast(msg: 'Registering...');

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
