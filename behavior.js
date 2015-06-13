StudentList = new Mongo.Collection('students');
BehaviorEvents = new Mongo.Collection('behavior_events');

if (Meteor.isClient) {
  Session.setDefault('selectedPeriod',0);
  Session.setDefault('selectedStudent',false);
  Session.setDefault('selectedBehavior','None');  
  Session.setDefault('addBehavior',false);  

  Template.body.events({
	    "submit .add_student": function (event) {
		var name = event.target.student_name.value;
		StudentList.insert({
			    name: name,
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
	    },
	    "change select[name='behaviors']": function(event){
		Session.set("selectedBehavior",event.target.value);
		if(Session.get('addBehavior') && 
		   Session.get('selectedBehavior')!="Cancel")
		{
		    BehaviorEvents.insert({    
			student_id: Session.get('selectedStudent'), 
			time: new Date(), 
			action: Session.get('selectedBehavior')   
		    });
		    Session.set('addBehavior',false);
		}    
		Session.set('selectedStudent',false);
// deselect the current selection (if you don't, mobile safari will show two items selected)
		var final_string = "select option[value='" + Session.get('selectedBehavior') + "']";
		$(final_string).removeAttr('selected');
		$("select option[value='None']").attr('selected','selected');
		Session.set('selectedBehavior','None');	
	    }	
	

      });	    
  Template.studentListing.helpers({
	  'students': function(){
	      return StudentList.find({period: parseInt(Session.get('selectedPeriod')),teacher: Meteor.userId()},{sort: {name:1}});    
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
	      Session.set('addBehavior',true);
	  }
      });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
