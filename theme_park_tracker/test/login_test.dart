import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:theme_park_tracker/main.dart';
import 'package:theme_park_tracker/tabs/AddParks.dart';


void main(){
  testWidgets('Testing login screen', (WidgetTester tester) async {
    await tester.pumpWidget(
        const MyApp(

        )
    );
    expect(find.byType(RichText), findsWidgets);
    expect(find.byType(MaterialButton), findsOneWidget);

  });
}
