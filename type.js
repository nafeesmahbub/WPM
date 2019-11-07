let socket
let color = '#FFF'
let strokeWidth = 4

let sessionID = ''



function setup() {
	// Creating canvas
	

	// Start the socket connection
	socket = io.connect()

	// Callback function
	socket.on('mouse', data => {
		stroke(data.color)
		strokeWeight(data.strokeWidth)
		line(data.x, data.y, data.px, data.py)
	})

	socket.on('connect', function() {
		sessionID = socket.id;
		$("#sessionId").html(sessionID);
		if (typeof socket.id !== "undefined"){

			var html = '<tr id="'+socket.id+'"><th scope="row">1</th><td>YOU</td><td>'+socket.id+'</td><td id="wpm_'+socket.id+'">0</td></tr>';
			$('#online_users tr:last').after(html);	
		}
	});
	socket.on("online_users", (data) => {	
		//console.log(data);
		addNewOnlineUser(data);
		socket.emit('online_users_feedback', {sessionID: sessionID, to: data.new_user});
	})
	socket.on("disconnect_user", (data) => {		
		addNewOnlineUser(data);
	})
	socket.on("online_users_feedback_single", (data) => {		
		if (typeof data.sessionID !== "undefined"){			
			var html = '<tr id="'+data.sessionID+'"><th scope="row">1</th><td>'+data.sessionID+'</td><td>Opponent</td><td id="wpm_'+data.sessionID+'">0</td></tr>';
			$('#online_users tr:last').after(html);	
		}	
	})
	socket.on("disconnect_user", (data) => {		
		$('#'+data.id).remove();
	})
	socket.on("show_WPM_feedback", (data) => {
		//console.log(data);			
		$('#wpm_'+data.data.sessionID).html(data.data.netWPM);
	})

	

	

	// Getting our buttons and the holder through the p5.js dom
	const color_picker = select('#pickcolor')
	const color_btn = select('#color-btn')
	const color_holder = select('#color-holder')

	const stroke_width_picker = select('#stroke-width-picker')
	const stroke_btn = select('#stroke-btn')

	// // Adding a mousePressed listener to the button
	// color_btn.mousePressed(() => {
	// 	// Checking if the input is a valid hex color
	// 	if (/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color_picker.value())) {
	// 		color = color_picker.value()
	// 		color_holder.style('background-color', color)
	// 	}
	// 	else {console.log('Enter a valid hex value')}
	// })

	// // Adding a mousePressed listener to the button
	// stroke_btn.mousePressed(() => {
	// 	const width = parseInt(stroke_width_picker.value())
	// 	if (width > 0) strokeWidth = width
	// })
}

function addNewOnlineUser(data){
	if (typeof data.new_user !== "undefined") {
		var html = '<tr id="'+data.new_user+'"><th scope="row">1</th><td>'+data.new_user+'</td><td>Opponent</td><td id="wpm_'+data.new_user+'">0</td></tr>';
		$('#online_users tr:last').after(html);		
	}
}

function mouseDragged() {
	// Draw
	stroke(color)
	strokeWeight(strokeWidth)
	line(mouseX, mouseY, pmouseX, pmouseY)

	// Send the mouse coordinates
	sendmouse(mouseX, mouseY, pmouseX, pmouseY)
}

// Sending data to the socket
function sendmouse(x, y, pX, pY) {
	const data = {
		x: x,
		y: y,
		px: pX,
		py: pY,
		color: color,
		strokeWidth: strokeWidth,
	}

	socket.emit('mouse', data)
}

function sortTable() {
	var table, rows, switching, i, x, y, shouldSwitch;
	table = document.getElementById("online_users");
	switching = true;
	/*Make a loop that will continue until
	no switching has been done:*/
	while (switching) {
	  //start by saying: no switching is done:
	  switching = false;
	  rows = table.rows;
	  /*Loop through all table rows (except the
	  first, which contains table headers):*/
	  for (i = 1; i < (rows.length - 1); i++) {
		//start by saying there should be no switching:
		shouldSwitch = false;
		/*Get the two elements you want to compare,
		one from current row and one from the next:*/
		x = rows[i].getElementsByTagName("TD")[2].innerHTML;
		y = rows[i + 1].getElementsByTagName("TD")[2].innerHTML;			
		//check if the two rows should switch place:
		x = parseInt(x);
		y = parseInt(y);
		if(Number.isNaN(x))
			x = 0;
		if(Number.isNaN(y))
			y = 0;
		console.log(x,y);
		if (x > y) {
		  //if so, mark as a switch and break the loop:
		  shouldSwitch = true;
		  break;
		}
	  }
	  if (shouldSwitch) {
		/*If a switch has been marked, make the switch
		and mark that a switch has been done:*/
		var row = rows[i].parentNode.parentNode,
        sibling = row.previousElementSibling,
        anchor = row.nextElementSibling,
        parent = row.parentNode;

		parent.insertBefore(row, sibling);
		//rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
		switching = true;
	  }
	}
  }

$(function() {
	
	setTimeout(function() {StopTime(); alert('Time Up.')}, 100000);

	var table = $('table');
    
    $('#wpm_header')
        .wrapInner('<span title="sort this column"/>')
        .each(function(){
            
            var th = $(this),
                thIndex = th.index(),
                inverse = true;
            
            th.click(function(){
                
                table.find('td').filter(function(){
                    
                    return $(this).index() === thIndex;
                    
                }).sortElements(function(a, b){
                    
                    return $.text([a]) > $.text([b]) ?
                        inverse ? -1 : 1
                        : inverse ? 1 : -1;
                    
                }, function(){
                    
                    // parentNode is the element we want to move
                    return this.parentNode; 
                    
                });
                
                inverse = inverse;
                    
            });
                
        });
  
  });