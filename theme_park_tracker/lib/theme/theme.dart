import 'package:flutter/material.dart';
import 'package:hexcolor/hexcolor.dart';



// select colors for the either dark or light mode

ThemeData lightMode = ThemeData(
    brightness: Brightness.light,
    colorScheme: ColorScheme.light(
      background: Colors.white,
      primary: HexColor("Eb5756"),
      brightness: Brightness.light,
      secondary: HexColor("#99dbFF"),
      tertiary: Colors.black,

    ),
  appBarTheme: AppBarTheme(color: HexColor("#EB5756")),
  tabBarTheme: TabBarTheme(dividerColor: Colors.black, indicatorColor: HexColor("Eb7978"), labelColor:HexColor("Eb7978"), unselectedLabelColor: Colors.grey),
);

ThemeData darkMode = ThemeData(
    brightness: Brightness.dark,
    colorScheme: ColorScheme.dark(
      background: Colors.black,
      primary: Colors.grey.shade800,
      secondary: Colors.grey.shade800,
      tertiary: Colors.white,

      brightness: Brightness.dark,
    ),
  appBarTheme: AppBarTheme(color: Colors.black),
  tabBarTheme: TabBarTheme(dividerColor: Colors.white, indicatorColor: Colors.white, labelColor: Colors.white, unselectedLabelColor: Colors.grey),
);




