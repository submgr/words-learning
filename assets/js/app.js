var current_word = 1;
var current_dictionary = 0;

var current_dictionary_sourceDirection;
var current_dictionary_destinationDirection;
var isReverted = false;
var areImagesPresented = null;

var temp_data = null;

function problem_handler(reasoning){
	//will be stated here.
}

var temp_dictionaries_list_data;

function get_dictionaries_list(){
	$.ajax({
        url: "backend/dictionary-list.php",
        type: 'GET',
        success: function (data) {
			$('#list_of_dictionaries_ListData').empty();
			data = JSON.parse(data);
			temp_dictionaries_list_data = data;
			data_size = data.length;
			for(i = 0; i < data_size; i++){
				$('#list_of_dictionaries_ListData').append(`<a onclick="prepare_dictionary(` + data[i].id + `);" class="list-group-item list-group-item-action" data-bs-dismiss="modal"><b>ID: <i>` + data[i].id + `</i></b> &nbsp;&nbsp;` + data[i].title + ` </a>`);
			}
        },
        cache: false,
        contentType: false,
        processData: false
    });
}

var temp_data_parsed_json;
var current_words_amount = 0;

function ui_dictionary_directions(source = current_dictionary_sourceDirection, destination = current_dictionary_destinationDirection){
	$('#data_languageDictionary_Direction_Source').text(source);
	$('#data_languageDictionary_Direction_Destination').text(destination);
}

function prepare_dictionary(id){
	$.ajax({
        url: "backend/dictionary-gather.php?id=" + id,
        type: 'GET',
        success: function (data) {
			data = JSON.parse(data);
			temp_data = data;
			temp_data_parsed_json = JSON.parse(temp_data.data);
			current_words_amount = temp_data_parsed_json.length;
			current_word = 1;
			current_dictionary = id;

			if(data.images_path){
				areImagesPresented = data.images_path;
			}else{
				areImagesPresented = null;
			}

			let words_wordbook_contains = current_words_amount-1
			$('#dictionary_optiions').text('Словарь: ' + data.title + ' (' + words_wordbook_contains + ' слов)');

			current_dictionary_sourceDirection = data.source;
			current_dictionary_destinationDirection = data.destination;

			ui_dictionary_directions();

			if(areImagesPresented != null){
				$('#wordimage_div').show();
			}else{
				$('#wordimage_div').hide();
			}
			
			$('#btn_thenextword').show();

			word_loader();
        },
        cache: false,
        contentType: false,
        processData: false
    });
}

function word_loader(numeric = current_word){
	if(numeric + 1 >= current_words_amount){
		//another functionality possible feature - hide 'the next word' button on the latest word, just uncomment to apply!
		//$('#btn_thenextword').hide();

		// resetting counter to make it possible for user to follow the dictionary around in circles
		current_word = 0;
	}

	if(numeric < 1){
		numeric = 1;
	}

	word_destination_toggler("hide");
	current_word_piece = temp_data_parsed_json[numeric];

	if(isReverted == true){
		temp_word_trimmer_first = 1;
		temp_word_trimmer_second = 0;
	} else{
		temp_word_trimmer_first = 0;
		temp_word_trimmer_second = 1;
	}

	if(areImagesPresented != null){
		$('#wordimage_img').attr("src","./backend/storage/" + areImagesPresented + "/" + current_word_piece[2]);
	}

	$('#data_languageDictionary_Word_Source').text(current_word_piece[temp_word_trimmer_first]);
	$('#data_languageDictionary_Word_Destination').text(current_word_piece[temp_word_trimmer_second]);
	current_word++;
	
}

function locationHashChanged() {
	var current_hash = location.hash;
	var dictionary_id = current_hash.substring(current_hash.indexOf('=') + 1);
	prepare_dictionary(dictionary_id);
}
  
window.onhashchange = locationHashChanged;

function word_destination_toggler(action){
	if(action == "show"){
		$('#data_languageDictionary_Word_Destination').removeClass("blur_text");
	}else if(action == "toggle"){
		$('#data_languageDictionary_Word_Destination').toggleClass("blur_text");
	}else{
		$('#data_languageDictionary_Word_Destination').addClass("blur_text");
	}
}

word_destination_toggler("show");

function word_source_listen(){
	var msg = new SpeechSynthesisUtterance('Hello World');
		window.speechSynthesis.speak(msg);
}

function dictionary_revert(){
	if(isReverted == true){
		isReverted = false;
		ui_dictionary_directions(current_dictionary_sourceDirection, current_dictionary_destinationDirection);
	}else{
		isReverted = true;
		ui_dictionary_directions(current_dictionary_destinationDirection, current_dictionary_sourceDirection);
	}


	current_word--;

	word_loader(current_word);
}

$("form#data").submit(function(e) {
    e.preventDefault();    
    var formData = new FormData(this);

    $.ajax({
        url: "backend/dictionary-add.php",
        type: 'POST',
        data: formData,
        success: function (data) {
            switch (data) {
				case "error":
					alert("Произошла ошибка.")
					break;
			
				default:
					window.location.hash = "wordbook=" + data;
					break;
			}
        },
        cache: false,
        contentType: false,
        processData: false
    });
});

function text_to_speech(){
	let utterance = new SpeechSynthesisUtterance($('#data_languageDictionary_Word_Source').text());
	speechSynthesis.speak(utterance);
}

function handle_allWordsModalOpen(){

	var array_dataBundle = [];

	for(i = 0; i < temp_dictionaries_list_data.length; i++){
		temp_local_specificDictionary = JSON.parse(temp_dictionaries_list_data[i].data);
		for(k = 1; k < temp_local_specificDictionary.length; k++){
			let images_path;
			let images_link_tag;
			if(temp_local_specificDictionary[k][2] != undefined){
				images_path = "./backend/storage/" + temp_dictionaries_list_data[i].images_path + "/" + temp_local_specificDictionary[k][2];
				images_link_tag = "<a href='" + images_path + "'> " + images_path + " </a>"
			}
			array_dataBundle.push([temp_local_specificDictionary[k][0], temp_local_specificDictionary[k][1], temp_dictionaries_list_data[i].title, images_link_tag])
		}
	}

	$('#table_id').DataTable({
		data: array_dataBundle,
		destroy: true,
		"columns": [
			null,
			null,
			null,
			{
			  "defaultContent": "<i>отсутствует</i>"
			}
		  ],
		  language: {
			url: './assets/localisation/ru_RU.json'
		}
	});
}
