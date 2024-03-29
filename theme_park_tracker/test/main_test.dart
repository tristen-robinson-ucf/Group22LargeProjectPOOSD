import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:theme_park_tracker/main.dart';
import 'package:theme_park_tracker/tabs/AddParks.dart';


void main(){
  testWidgets('Testing email verification screen', (WidgetTester tester) async {
    await tester.pumpWidget(
        verifyEmailScreen(
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          username: '',
          password: '',
        )
    );
    expect(find.byType(Container), findsWidgets);
    expect(find.byType(MaterialButton), findsOneWidget);
    expect(find.byType(Text), findsWidgets);
  });
}
