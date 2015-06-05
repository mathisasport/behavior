StudentList = new Mongo.Collection('students');

if (Meteor.isClient) {
  Template.body.events({
	    "submit .add_student": function (event) {
		var name = event.target.student_name.value;
		var student_id = 12345;
		console.log('hey');
		StudentList.insert({
			    name: name,
			    studentid: student_id,
			    createdAt: new Date(),
			    period: Session.get('selectedPeriod'),
			    teacher: Meteor.userId(),
			    score: 100
			    });
		// Clear form
		event.target.student_name.value = "";
		// Prevent default form submit
		return false;
	    },
	    "change select[name='section']": function(event){
		Session.set("selectedPeriod",parseInt(event.target.value));	
	    }	

      });	    
  Template.studentListing.helpers({
	  'students': function(){
	      return StudentList.find({period: parseInt(Session.get('selectedPeriod')),teacher: Meteor.userId()});    
	  },
	  'selectedClass': function(){
	      if (this._id == Session.get('selectedStudent')){
		  return "selected";
	      }
	  }    
      });			  

  Template.studentListing.events({
	  'click .studentItem': function(){
	      Session.set('selectedStudent',this._id);
	      var new_score = this.score >= 10 ? this.score - 10: 0;
	      StudentList.update(this._id, {$set: {score: new_score}});
	  }
      });

  Session.setDefault('selectedPeriod',0);
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
