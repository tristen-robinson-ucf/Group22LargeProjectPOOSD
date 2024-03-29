import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:theme_park_tracker/main.dart';
import 'package:theme_park_tracker/tabs/PlannedTrips.dart';


void main(){
  testWidgets('Testing page to make new trips', (WidgetTester tester) async {
    await tester.pumpWidget(
        MakeTrip(
          id: -2,
          firstname: '',
          lastname: '',
          parkArr: [],
        )
    );

    await tester.pumpAndSettle(const Duration(seconds: 5));
    expect(find.byType(Center), findsWidgets);
    expect(find.byType(Text), findsWidgets);
  });
}
