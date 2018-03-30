$(document).ready(function(){
	var intervalId;
	var clockRunning = false
	var gameOngoing = true
	var score = 0
	var unanswered = 0

	var gameCount = 0

	var questionCount = 0
	var Questions
	var curQuestion

	$('.typeBtn').on('click', function(){
		gameOngoing = true
		$('.correct').hide()

	    if(gameCount>0){
			$('.answers').css('visibility', 'hidden')
		}

	    var type = $(this).html()

	    if(type === 'General Knowledge'){
	    		var queryURL = "https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple"
	    }else if(type === 'Sports'){
	    		var queryURL = "https://opentdb.com/api.php?amount=10&category=21&difficulty=medium&type=multiple"
	    }else if(type === 'Video Games'){
	    		var queryURL = "https://opentdb.com/api.php?amount=10&category=15&difficulty=medium&type=multiple"
	    }else if(type = 'Film'){
	    		var queryURL = "https://opentdb.com/api.php?amount=10&category=11&difficulty=medium&type=multiple"
	    }

	    $.ajax({
	      url: queryURL,
	      method: "GET"
	    }).then(function(response) {
	    	$('#startBtn').css('visibility', 'visible')

			Questions = response.results
			console.log(Questions, Questions[1].question)

			function shuffle(array) {
			 	var currentIndex = array.length, temporaryValue, randomIndex;

				while (0 !== currentIndex) {
			    	// Pick a remaining element...
				    randomIndex = Math.floor(Math.random() * currentIndex);
				    currentIndex -= 1;

				    // And swap it with the current element.
				    temporaryValue = array[currentIndex];
				    array[currentIndex] = array[randomIndex];
				    array[randomIndex] = temporaryValue;
			  	}

			  return array;
			}


			function chooseQuestion(){
				$('.correct').hide()

				if(questionCount < 10){
					curQuestion = Questions[questionCount]
					questionCount++

					var arr = [curQuestion.correct_answer,curQuestion.incorrect_answers[0],curQuestion.incorrect_answers[1],curQuestion.incorrect_answers[2]]
					arr = shuffle(arr) 

					$('#categories').css("visibility","hidden")
					$('#questionField').html(curQuestion.question)
					$('#answer1').html(arr[0])
					$('#answer2').html(arr[1])
					$('#answer3').html(arr[2])
					$('#answer4').html(arr[3])
	
					displayAll()

					$('#timing').text('Time Remaining: 30 seconds')
					timer.start()

				}else{
					gameOngoing = false
					$('.correct').css("visibility","hidden")

					$('#questionField').html("All done, here is how you did:")
					
					$('#answer1').html("Correct: " + score)
					$('#answer2').html("Incorrect Answers: " + (10 - score - unanswered))
					$('#answer3').html("Unanswered: " + unanswered)
					
					$('.answers').css("visibility","visible")
					$('#answer4').empty()
					
					questionCount = 0
					score = 0
					unanswered = 0
					gameCount++
					
					$('#categories').css("visibility","visible")
				}
			}

			function displayAll(){
				$('#timing').css("visibility","visible")
				$('#question').css("visibility","visible")
				$('#startBtn').css("visibility","hidden")
				$('.answers').css("visibility","visible")
			}

			function displayAnswer(){
				$('.correct').show()
				$('.correct').css("visibility","visible")
				$('#correctAnswer').html(curQuestion.correct_answer)
			}

			$('#startBtn').on('click', function(){
				console.log("here")
				chooseQuestion()
			})

			$('.answers').on('click', function(){
				if(gameOngoing === true){
					timer.stop()
					timer.reset()

					answer = $(this).text().trim()
					console.log(answer, typeof answer, curQuestion.correct_answer, typeof curQuestion.correct_answer)

					if(answer === curQuestion.correct_answer){
						score++

						$('#questionField').text("Correct!")

						$('.answers').css("visibility","hidden")

			        	window.setTimeout(chooseQuestion, 3000);
					}else{
						$('#questionField').text("Nope!")

						$('.answers').css("visibility","hidden")
						displayAnswer()

						window.setTimeout(chooseQuestion, 3000);
					}
				}else{
					alert("please select a new category")
				}
			})

			var timer = {
			  	time: 30,

			  	reset: function() {
			    	timer.time = 30
			    	clockRunning = false
			  	},

				start: function() {
					if (!clockRunning) {
			    		intervalID = setInterval(timer.count, 1000)
			    		clockRunning = true
			    	}
			  	},

			  	stop: function() {
			    	clearInterval(intervalID)
			    	clockRunning = false
			  	},

			  	count: function() {
			    	timer.time--
			    	$('#timing').html("Time Remaining: "+ timer.time + " seconds")
			    	if(timer.time === 0){
			    		timer.stop()
			    		timer.reset()

			    		unanswered++

			    		$('#questionField').text("You ran out of time!")

						$('.answers').css("visibility","hidden")
						displayAnswer()

						window.setTimeout(chooseQuestion, 3000);
			    	}
			  	}
			}

		})
		// }else{
		// 	alert("Please choose a new category")
		// }
	})
});