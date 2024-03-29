import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:theme_park_tracker/tabs/TripRides.dart';
import 'package:theme_park_tracker/tabs/AddParks.dart';


void main(){
  testWidgets('Testing add parks widget', (WidgetTester tester) async {
    await tester.pumpWidget(
        AddParks(
      id: -2,
      firstname: '',
      lastname: '',
      parkArr: [],
    )
    );

    await tester.pumpAndSettle(const Duration(seconds: 5));

    expect(find.byType(IconButton), findsWidgets);
    expect(find.byType(ListView), findsOne);
  });
}
