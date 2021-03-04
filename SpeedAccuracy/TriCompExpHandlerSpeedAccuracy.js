Global_info = {};
Global_info.start = Date.now();
Global_info.end = 0;
Global_info.round = 0; //0 = before change; 1 = after change
Global_info.history = [];
Global_info.sideRunNum = 0; //indicates which Triangle configuration side length is up next
Global_info.angleRunNum = 0; //indicates which Triangle configuration angle size is up next
Global_info.consent=0;
Global_info.comments=0;
Global_info.TotRuns=100; //indicates how many total runs the experiment has
//Global_info.curPage=0;
Global_info.userResponse='';
Global_info.setup='';
Global_info.userID='';
Global_info.timeoutArr=[2, 4, 7, 10, 15]; //Possible line widths
Global_info.timeoutparam=200; //initial value for the timeout
Global_info.numCorrect=0; //number of correct answers
Global_info.numAng=2; //number of angles
Global_info.numLen=5; //number of angles
Global_info.trainRuns=Global_info.numAng*Global_info.numLen;
// var TriBaseLengthPerArray=[1, 0.64, 0.32 ,0.16 ,0.04];
// var TriBaseAngleArray=[Math.PI/6, Math.PI/5, Math.PI/4];

//Create a Random array of runs for this subject, runs #'s go from 1-10
RunNumOrder=getRandomArray(_.range(0,Global_info.TotRuns),Global_info.TotRuns);
RunNumOrder2=nonRepeatRunOrder(Global_info.TotRuns,Global_info.trainRuns);

//Create a Random array of runs for this subject
function nonRepeatRunOrder(totRunsTemp,trainRunsTemp) {
		var order=[],flag=0,i,j;
		while (flag==0) {
				order=createDevOrder(trainRunsTemp,totRunsTemp/trainRunsTemp);
				if (order[9]!=order[10] && order[19]!=order[20] && order[29]!=order[30] && order[39]!=order[40] && order[49]!=order[50] && order[59]!=order[60] && order[69]!=order[70] && order[79]!=order[80]) {
						flag=1;
				}
		}
		return order;
};

function createDevOrder(numRef,numTrials) {
	var DevArray=[], tempArr, i, j;
	for (i=0; i<numRef; i++) {
		tempArr=getRandomArray(_.range(0,numTrials),numTrials); //rand sequence to dictate the angle per run (0,6)
		DevArray.push.apply(DevArray, tempArr);
	};
	return DevArray;
};

// A function that shuffles the array
function getRandomArray(arr, size) {
	var shuffled = arr.slice(0), i = arr.length, temp, index;
	while (i--) {
		index = Math.floor((i + 1) * Math.random());
		temp = shuffled[index];
		shuffled[index] = shuffled[i];
		shuffled[i] = temp;
	}
	return shuffled.slice(0, size);
};


function trainTriangle() {
	//alert('drawTriangle'+Global_info.curPage)
	$('#triangleTrain').empty();

	var paper2 = Snap("#triangleTrain").attr({width:$(window).width(), height:$(window).height()});
	var StrkWdth=2;
	var dimx = $(window).width();
	var dimy = $(window).height();
  var dotSize=5;

	// drawing the triangle
	//parameters of the run:
	var LengthBaseOrig=dimx*.8; //Max Base Length
	var LengthAngleSideOrig=LengthBaseOrig*.1;
	var AngleOrig=Math.PI/4; //Size of angle in radians - 45 deg
	var BaseLengthFactor=1; //Get the current percent of side length from Global_info.sideRunNum
	var BaseLength=LengthBaseOrig*BaseLengthFactor;
    var height = Math.tan(AngleOrig)*.5*BaseLength;

	var TriBaseXStartOrig=dimx*.05; //Origin position in the X axis for maximal base length
	var TriBaseXEndOrig=LengthBaseOrig+TriBaseXStartOrig; //End position of base for maximal base length

	var TriBaseXStart=TriBaseXStartOrig+0.5*(1-BaseLengthFactor)*LengthBaseOrig;
	var TriBaseXEnd=TriBaseXStart+BaseLength;
	var TriBaseYPos=(dimy - height)*.5+height;
	var TriSideXLengthIn=LengthAngleSideOrig*BaseLengthFactor;
	var TriSideYLengthUp=Math.tan(AngleOrig)*LengthAngleSideOrig*BaseLengthFactor;
//	var triBase = paper2.line(TriBaseXStart,TriBaseYPos,TriBaseXEnd,TriBaseYPos).attr({strokeWidth:5,stroke:"black",strokeLinecap:"round"});

	//drawing the real location of the third vertex
	var realPosition=paper2.circle(TriBaseXStart+0.5*BaseLength,TriBaseYPos-Math.tan(AngleOrig)*0.5*BaseLength,8).attr({fill:"lightblue"});


	//drawing the triangle
	var triBaseLeft = paper2.line(TriBaseXStart,TriBaseYPos,TriBaseXStart+TriSideXLengthIn*1.3,TriBaseYPos).attr({strokeWidth:StrkWdth,stroke:"black",strokeLinecap:"round"});
	var triBaseRight = paper2.line(TriBaseXEnd,TriBaseYPos,TriBaseXEnd-TriSideXLengthIn*1.3,TriBaseYPos).attr({strokeWidth:StrkWdth,stroke:"black",strokeLinecap:"round"});
	var triRightSide = paper2.line(TriBaseXEnd,TriBaseYPos,TriBaseXEnd-TriSideXLengthIn,TriBaseYPos-TriSideYLengthUp).attr({strokeWidth:StrkWdth,stroke:"black",strokeLinecap:"round"});
	var triLeftSide = paper2.line(TriBaseXStart,TriBaseYPos,TriBaseXStart+TriSideXLengthIn,TriBaseYPos-TriSideYLengthUp).attr({strokeWidth:StrkWdth,stroke:"black",strokeLinecap:"round"});
	var triTownLeft = paper2.circle(TriBaseXStart,TriBaseYPos,dotSize).attr({fill:"firebrick"});
	var triTownRight = paper2.circle(TriBaseXEnd,TriBaseYPos,dotSize).attr({fill:"firebrick"});

	//drawing the third vertex
	var textPosX = 20;
	var textPosY = 15;
	var thrdVrtxPosX= 200;
	var thrdVrtxPosY=textPosY+10;
	var thrdVrtxTxt=paper2.text(textPosX, textPosY, "Click where the 3rd vertex position is (marked in light blue)").attr({"font-size": "20px"});
	var thirdVertex = paper2.circle(thrdVrtxPosX,thrdVrtxPosY,dotSize).attr({fill:"firebrick"});

  var backgroundCircle = paper2.circle(thrdVrtxPosX, thrdVrtxPosY, 15).attr({fill: "white", "fill-opacity": 0});

  backgroundCircle.drag(function(dx,dy){
      backgroundCircle.attr({cx:+x1+dx,cy:+y1+dy});
			thirdVertex.attr({cx:+x2+dx, cy:+y2+dy})
    		},function(){
        x1 = backgroundCircle.attr("cx");
        y1 = backgroundCircle.attr("cy");
        x2 = thirdVertex.attr("cx");
        y2 = thirdVertex.attr("cy");
    },function(){
  });

  backgroundCircle.mouseover(function(){
      this.attr({fill: 'grey', "fill-opacity": 0.5});
	});

  backgroundCircle.mouseout(function(){
      this.attr({fill: 'white', "fill-opacity": 0});
  });

	function moveFunc( ev, x, y ) {
		backgroundCircle.attr({cx:x,cy:y});
		thirdVertex.attr({cx:x, cy:y})
	};

	paper2.click(moveFunc);

	// Next Page button
	var ButtonPosX=dimx;
	var ButtonPosY=20;
	/*
	var NextButtonTxt = paper2.text(ButtonPosX-120, ButtonPosY+20,"Continue").attr({fontsize:50});
	var NextButtonRect = paper2.rect(ButtonPosX-120-20, ButtonPosY,120,30,5,5).attr({strokeWidth:5,stroke:"black",strokeLinecap:"round",fill:"lightblue"});
	var groupButton = paper2.g(NextButtonRect,NextButtonTxt);

	groupButton.mouseover(function(){
    this.attr({cursor: 'pointer'});
	});

	groupButton.click(function(){

    	var angleValue=90;
    	if ((thirdVertex.attr("cx")==thrdVrtxPosX)||(thirdVertex.attr("cy")==thrdVrtxPosY)||(Math.abs(Math.round(angleValue))==180)) {
    		alert('Please position the third vertex \n by clicking where its estimated location is \n before continuing to the next page');
    	}
        else {
        	Global_info.setup='TrainingTrial';
        	Global_info.userResponse=thirdVertex.attr("cx")+'_'+thirdVertex.attr("cy")+'_'+Math.abs(Math.round(angleValue));
        	onNext();
        };
	});
	*/

	$('#TriangleTraining').on('keydown', function(event){
		var angleValue=90;
		if ((thirdVertex.attr("cx")==thrdVrtxPosX)||(thirdVertex.attr("cy")==thrdVrtxPosY)||(Math.abs(Math.round(angleValue))==180)) {
			alert('Please find the missing town \n by clicking on its estimated position \n before continuing to the next page');
		}
			else {
				Global_info.curTrainNum+=1;
				Global_info.setup='TrainingTrial';
				Global_info.userResponse=thirdVertex.attr("cx")+'_'+thirdVertex.attr("cy")+'_'+Math.abs(Math.round(angleValue));
				onNext();
			};
		});

};



function drawTriangle() {
	var timeout=Global_info.timeoutparam*1000;
	//alert('drawTriangle'+Global_info.curPage)
	$('#triangle').empty();
	$('#TriangleCompletionPages').off('keydown');

	var paper = Snap("#triangle").attr({width:$(window).width(),height:$(window).height()});

	var TriBaseLengthPerArray=[1, 0.64, 0.33 ,0.1 ,0.03];
//	var TriBaseAngleArray=[Math.PI/6, Math.PI/5, Math.PI/4];
	var TriBaseAngleArray=[Math.PI/6, Math.PI/4];
	var dotSize=4;
	var StrkWdth=2;
	var dimx = $(window).width();
	var dimy = $(window).height();

	var LengthBaseOrig=dimx*.8; //Max Base Length
	var LengthAngleSideOrig=LengthBaseOrig*.1;
//	var AngleOrig=TriBaseAngleArray[Math.floor(Global_info.angleRunNum%3)]; //Size of angle in radians - 45 deg
	var AngleOrig=TriBaseAngleArray[Math.floor(Global_info.angleRunNum%Global_info.numAng)]; //Size of angle in radians - 45 deg
	var BaseLengthFactor=TriBaseLengthPerArray[Math.floor(Global_info.sideRunNum%Global_info.numLen)]; //Get the current percent of side length from Global_info.sideRunNum
	var BaseLength=LengthBaseOrig*BaseLengthFactor;
    var height = Math.tan(Math.PI/4)*.5*LengthBaseOrig

	var TriBaseXStartOrig=dimx*.05; //Origin position in the X axis for maximal base length
	var TriBaseXEndOrig=LengthBaseOrig+TriBaseXStartOrig; //End position of base for maximal base length

	var TriBaseXStart=TriBaseXStartOrig+0.5*(1-BaseLengthFactor)*LengthBaseOrig;
	var TriBaseXEnd=TriBaseXStart+BaseLength;
    //

//	var TriBaseYPos=(dimy - height)*.5+height;

	var TriBaseYPos=dimy-50;
	var TriSideXLengthIn=LengthAngleSideOrig*BaseLengthFactor;
	var TriSideYLengthUp=Math.tan(AngleOrig)*TriSideXLengthIn;

	//drawing the triangle
	var triBaseLeft = paper.line(TriBaseXStart,TriBaseYPos,TriBaseXStart+TriSideXLengthIn*1.3,TriBaseYPos).attr({strokeWidth:StrkWdth,stroke:"black",strokeLinecap:"round"});
	var triBaseRight = paper.line(TriBaseXEnd,TriBaseYPos,TriBaseXEnd-TriSideXLengthIn*1.3,TriBaseYPos).attr({strokeWidth:StrkWdth,stroke:"black",strokeLinecap:"round"});
	var triRightSide = paper.line(TriBaseXEnd,TriBaseYPos,TriBaseXEnd-TriSideXLengthIn,TriBaseYPos-TriSideYLengthUp).attr({strokeWidth:StrkWdth,stroke:"black",strokeLinecap:"round"});
	var triLeftSide = paper.line(TriBaseXStart,TriBaseYPos,TriBaseXStart+TriSideXLengthIn,TriBaseYPos-TriSideYLengthUp).attr({strokeWidth:StrkWdth,stroke:"black",strokeLinecap:"round"});
	var triTownLeft = paper.circle(TriBaseXStart,TriBaseYPos,dotSize).attr({fill:"firebrick"});
	var triTownRight = paper.circle(TriBaseXEnd,TriBaseYPos,dotSize).attr({fill:"firebrick"});

	var sides_array = [triBaseLeft, triBaseRight, triRightSide, triLeftSide,triTownLeft,triTownRight];
	//drawing the third vertex
	var textPosX = 20;
	var textPosY = 15;
	var thrdVrtxTxt=paper.text(textPosX, textPosY, "Click where the 3rd vertex position is").attr({"font-size": "20px"});
  var thrdVrtxPosX= 200;
  var thrdVrtxPosY=textPosY+30;
	var thirdVertex = paper.circle(thrdVrtxPosX,thrdVrtxPosY,dotSize).attr({fill:"firebrick"});

  var backgroundCircle = paper.circle(thrdVrtxPosX, thrdVrtxPosY, 15).attr({fill: "white", "fill-opacity": 0});

	var thrdVrtxTxt=paper.text(textPosX, textPosY, "Click where the 3rd vertex position is").attr({"font-size": "20px"});

/*  backgroundCircle.drag(function(dx,dy){
        backgroundCircle.attr({cx:+x1+dx,cy:+y1+dy});
        thirdVertex.attr({cx:+x2+dx, cy:+y2+dy})
  },function(){
        x1 = backgroundCircle.attr("cx");
        y1 = backgroundCircle.attr("cy");
        x2 = thirdVertex.attr("cx");
        y2 = thirdVertex.attr("cy");
  },function(){
  });

  backgroundCircle.mouseover(function(){
      this.attr({fill: 'grey', "fill-opacity": 0.5});
  });

  backgroundCircle.mouseout(function(){
      this.attr({fill: 'white', "fill-opacity": 0});
  }); */

	//position the red dot by clicking instead of dragging
	function moveFunc( ev, x, y ) {
		backgroundCircle.attr({cx:x,cy:y});
		thirdVertex.attr({cx:x, cy:y})
	};

	paper.click(moveFunc);

	var ButtonPosX=0.9*dimx;
	var ButtonPosY=60;

	var seconds = timeout/1000;

	var clock=paper.circle(ButtonPosX,ButtonPosY,30).attr({strokeWidth:4,stroke:"black",fill:"white"});
	var clocktxt=paper.text(ButtonPosX,ButtonPosY+7,seconds).attr({"font-size":"20px","text-anchor":"middle"});


	var timeout = setTimeout(function() {
			for (i=0; i<sides_array.length;i++) {
					sides_array[i].attr({strokeWidth: 0});
			}
			thirdVertex.attr({"fill": "white"});
			times_up = true;
			alert('Time is up. Please hit the continue button');
	}, timeout);

	times_up = false;
	var interval = setInterval(function() {
			seconds=seconds-1;
			clocktxt.attr({text:seconds, "cx":ButtonPosX, "text-anchor":"middle"});
//        document.getElementById("timer").innerHTML = seconds+" seconds";
			if (seconds == 0) {
					clearInterval(interval);
			}
	}, 1000);

	function getDistance(pt1x,pt1y,pt2x,pt2y){
			var xx=pt1x-pt2x;
			var yy=pt1y-pt2y;
			return Math.sqrt(xx*xx+yy*yy);
	};

	$('#TriangleCompletionPages').on('keydown', function(event){
		var key = event.which;
		if( key === 13){
			var angleValue=90;
			if (((thirdVertex.attr("cx")==thrdVrtxPosX)||(thirdVertex.attr("cy")==thrdVrtxPosY)||(Math.abs(Math.round(angleValue))==180)) && !times_up) {
			alert('Please position the missing town \n by clicking on its estimated position \n before continuing to the next page');
			}
			else {
				var realPosX=TriBaseXStart+0.5*BaseLength;
				var realPosY=TriBaseYPos-Math.tan(AngleOrig)*0.5*BaseLength;
				var estPosX=thirdVertex.attr("cx");
				var estPosY=thirdVertex.attr("cy");
				// check correct answers
				if (getDistance(realPosX,realPosY,estPosX,estPosY)<=0.1*BaseLength && times_up==false){
						Global_info.numCorrect+=1;
					};
				Global_info.setup='Angle_'+Math.round(AngleOrig*180/Math.PI)+'_BaseFactor_'+BaseLengthFactor;
				Global_info.userResponse=thirdVertex.attr("cx")+'_'+thirdVertex.attr("cy")+'_'+Math.abs(Math.round(angleValue));
				// saved_while_moving: 1 for true if the user was not successful in hitting continue due to timer interruption
				Global_info.timeout = Number(times_up);
				clearInterval(interval);
				clearTimeout(timeout);
				onNext();
			};
		};
	});

};

function submit_demographis() {
	var gender=document.getElementById("gender").options[document.getElementById("gender").selectedIndex].value;
	var RightLeft=document.getElementById("RightLeft").options[document.getElementById("RightLeft").selectedIndex].value;
	var age = document.getElementById("age").value;
	var Education = document.getElementById("Education").value;
	var particID = document.getElementById("ParticipantID").value;
	var ExpNum=document.getElementById("ExpNum").options[document.getElementById("ExpNum").selectedIndex].value;
	Global_info.timeoutparam=Global_info.timeoutArr[ExpNum-1];
	if (gender=='' | age=='' | particID=='') {
		return false;
	}
	else
	{
		sendRequestPost('gender',gender);
		sendRequestPost('age',age);
		sendRequestPost('RightLeft',RightLeft);
		sendRequestPost('Education',Education);
		sendRequestPost('ParticipantID',particID);
		sendRequestPost('ExpNum',ExpNum);
		return true;
	}
};

/*function submit_demographis() {
	var gender=document.getElementById("gender").options[document.getElementById("gender").selectedIndex].value;
	var RightLeft=document.getElementById("RightLeft").options[document.getElementById("RightLeft").selectedIndex].value;
	var age = document.getElementById("age").value;
	var Education = document.getElementById("Education").value;

	if (gender=='' | age=='') {
//		onContinue.curPage = onContinue.curPage-1;
		return false;
	}
	else
	{
		sendRequestPost('gender',gender);
		sendRequestPost('age',age);
		sendRequestPost('RightLeft',RightLeft);
		sendRequestPost('Education',Education);
		return true;
	}
};*/

function getCheckedRadio(radio_group_name) {
    radio_group = document.getElementsByName(radio_group_name);
    for (var i = 0; i < radio_group.length; i++) {
		var button = radio_group[i];
		if (button.checked) {
			return button.value;
		};
	};
	return "noAnswer";
};

function logAnswersSet1_basic()
{
	var sol1_1=document.getElementById("sol1_1").value;
	var sol1_2=document.getElementById("sol1_2").value;
	var sol1_3=document.getElementById("sol1_3").value;
	var sol1_4=document.getElementById("sol1_4").value;
	sendRequestPost('sol1_1',sol1_1);
	sendRequestPost('sol1_2',sol1_2);
	sendRequestPost('sol1_3',sol1_3);
	sendRequestPost('sol1_4',sol1_4);
}

function submit_comments() {
	var comments = document.getElementById("endCommentsText").value;
	if (comments==""|| typeof comments == "undefined") {
		comments = "No comment";
	};
	sendRequestPost("EndComments",comments);
	Global_info.comments=1;
	onNext();
};


function submit_consent() {
	var radio_group = "yesno2Experiment";
	var consent = getCheckedRadio(radio_group);
	if (consent=="no"|| consent == "noAnswer") {
			return false;
	}	else{
		sendRequestPost("yesno2Experiment",consent);
		return true;
	};
};

function onNextuserdata(){
	if (submit_demographis()==false) {
		alert('please provide the requested information');
	} else	{onNext();};
};

function onNextConsentForm(){
	if (submit_consent()==false) {
		alert('If you wish to leave the study, please close the page. \n Otherwise, please check the consent button before proceeding');
	} else	{
		Global_info.consent=1;
		onNext();};
};

//What to do when people press the Continue button (Instructions,Experiment,Thanks+ID)
function onNext(){
	//alert('onNext'+Global_info.curPage)
	$('.page').hide();

	// At the beginning of the experiment - Take demographics data
	if(typeof Global_info.curPage == 'undefined') {
		Global_info.curPage = -3;
		//blank all pages
		$(".page").hide();
		$("#user_data").on('keydown', function(event){
			var key = event.which;
			if (key === 13){
				onNextuserdata();
			};
		});
		$("#user_data").show();
		$("#user_data").focus();
	};


	if(Global_info.curPage == -2) {
		//blank all pages
		$(".page").hide();
		$("#initial_instructions").on('keydown', function(event){
			var key = event.which;
			if (key === 13){
				onNext();
			};
		});
		$("#initial_instructions").show();
		$("#initial_instructions").focus();
	};

	// Show participants instructions
	if(Global_info.curPage == -1 && Global_info.consent==1) {
		//blank all pages
		$(".page").hide();
		trainTriangle();
		$("#TriangleTraining").show();
		$("#TriangleTraining").focus();
	};


	// Show participants the triangles
	if (Global_info.curPage<Global_info.TotRuns && Global_info.curPage>=0 && Global_info.consent==1) {
		Global_info.sideRunNum=RunNumOrder2[Global_info.curPage];
		Global_info.angleRunNum=RunNumOrder2[Global_info.curPage];
		//Measuring the time it took the subject to solve the last page
		Global_info.end=Date.now();
		var timeRound =Global_info.end-Global_info.start;
		var logInfo = 'Run'+Global_info.curPage+'_'+Global_info.setup+'_Time_'+timeRound+'_UserResponse_'+Global_info.userResponse+'_timeout_'+Global_info.timeout+'_Correct_'+Global_info.numCorrect;
		//alert(logInfo)
		sendRequestPost('data',logInfo);
		Global_info.start = Date.now();

		//Preparing the next Triangle configuration
		drawTriangle();
		$('#TriangleCompletionPages').show();
		$("#TriangleCompletionPages").focus();
	};

	// Get comments from the participants
	if (Global_info.curPage==Global_info.TotRuns && Global_info.comments==0) {
		//Measuring the time it took the subject to solve the last page
		Global_info.end=Date.now();
		var timeRound =Global_info.end-Global_info.start;
		var logInfo = 'Run'+Global_info.curPage+'_'+Global_info.setup+'_Time_'+timeRound+'_UserResponse_'+Global_info.userResponse+'_timeout_'+Global_info.timeout+'_Correct_'+Global_info.numCorrect;
		sendRequestPost('data',logInfo);
		Global_info.userID=sendRequestPost('timeRound',timeRound);
		Global_info.start = Date.now();

		//Hide everything and show a thank you page
		$(".page").hide();
		$("#endComments.page").show();
		$("#endComments").focus();
	};

//	if (Global_info.curPage>=Global_info.TotRuns && Global_info.comments==1) {
	if (Global_info.curPage>Global_info.TotRuns) {
		//Measuring the time it took the subject to solve the last page
		Global_info.end=Date.now();
		var timeRound =Global_info.end-Global_info.start;
		Global_info.userID=sendRequestPost('timeRound',timeRound);
		Global_info.start = Date.now();

		//Hide everything and show a thank you page
		$(".page").hide();
		$("#ThankYou.page").show();
		$("#thanks").text('Thank you for your participation.');
		$("#userID").text('Your Validation code is: ' + Global_info.userID +' and the number of correct answers is: '+Global_info.numCorrect);
	};
	Global_info.curPage++;
};

$(document).ready(function() {
	// At beginning - show instructions page
	$('.page').hide();
	$("#ConsentForm").on('keydown', function(event){
		var key = event.which;
		if (key === 13){
			onNextConsentForm();
		};
	});
	$('#ConsentForm').show();
	$('#ConsentForm').focus();
});
