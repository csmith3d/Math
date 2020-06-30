print "var questionLists = [\n";
for($i=1; $i<=12; $i++) {

		print "[";
		for($j=1; $j<12; $j++) {
				print "\"$j x $i\", ";
		}
		print "\"12 x $i\"],\n";
}
print "];\n";

print "var answerLists = [\n";
for($i=1; $i<=12; $i++) {

		print "[";
		for($j=1; $j<12; $j++) {
				print "\"".($j * $i)."\", ";
		}
		print "\"".(12 * $i)."\"],\n";
}
print "];\n";

print "var hintLists = [\n";
for($i=1; $i<=12; $i++) {

		print "[";
		for($j=1; $j<12; $j++) {
				print "\"\", ";
		}
		print "\"\"],\n";
}
print "];\n";

