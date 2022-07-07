//функция filterByType принимает тип данных type и сколько угодно значений value (...values)
//переданные значения обраатываются методом-перебором filter
//filter создаёт новый массив, в котором остаются только те значение
//у которых найденный тип данных (typeof value) равен переданному type
const filterByType = (type, ...values) =>
	values.filter(value => typeof value === type)

//функция hideAllResponseBlocks()
hideAllResponseBlocks = () => {
	//в dociment ищутся все div с селктором dialog__response-block
	//затем все найденные элемементы div заносятся в массив и записываются в
	//responseBlocksArray
	const responseBlocksArray = Array.from(document.querySelectorAll('div.dialog__response-block'));
	//массив responseBlocksArray перебирается с помощью forEach
	//в каждом найденном div в style свойству display задётся none
	//то есть все эти div становятся невидимыми
	responseBlocksArray.forEach(block => block.style.display = 'none');
}
//в функцию showResponseBlock передётся три аргумента
//первый - класс-селектор, второй - сообщение, третий - идентификатор-селектор
showResponseBlock = (blockSelector, msgText, spanSelector) => {
	//вызывается функция hideAllResponseBlocks()
	hideAllResponseBlocks();
	//ищется элемент с переданным селектором-классом blockSelector
	//и найденному селектору в style свойству display задётся block
	//то есть он становится видимым
	document.querySelector(blockSelector).style.display = 'block';
	//если был передан spanSelector, то тогда 
	if (spanSelector) {
		// в элемент с id = spanSelector
		//устанавливается  textContent = переданное сообщение msgText
		document.querySelector(spanSelector).textContent = msgText;
	}
}
//в функцию showResponseBlock передаётся класс .dialog__response-block_error (см. css)
//также передаётся сообщение msgText с ошибкой и устанавливается в элемент с id = #error
showError = msgText => showResponseBlock('.dialog__response-block_error', msgText, '#error')
//в функцию showResponseBlock передаётся класс .dialog__response-block_ok (см. css)
//также передаётся сообщение msgText с отфильтрованными данными и устанавливается в элемент с id = #ok
showResults = msgText => showResponseBlock('.dialog__response-block_ok', msgText, '#ok')
//функция, вызывающаяся ессли ничего не было введено в dataInput
//в функцию showResponseBlock передаётся класс .dialog__response-block_no-results (см. css)
showNoResults = () => showResponseBlock('.dialog__response-block_no-results')
//в функцию tryFilterByType передаются два аргумента, выбранный тип и установленное значение
tryFilterByType = (type, values) => {
	//блок try-catch для обработки кода и ошибок
	try {
		// создаётся новый массив valuesArray
		//сначала создаётся функция filterByType(), в неё передаются значения
		// через бэктики тип и значения, но функция не выполняется
		// метод эвал выполняет созданную функцию
		// filterByType возвращает массив данных в виде [ x, y, z, ...]
		//с помощью join(", ") тип и значения перечисляются через , и пробел
		//получается строка уже отфильтрованных значений =  x, y, z, ...
		const valuesArray = eval(`filterByType('${type}', ${values})`).join(", ");
		console.log(valuesArray.length)
		//подготавливается создаётся сообщение alertMsg в результаты
		//если в массиве valuesArray что-либо есть, то 
		const alertMsg = (valuesArray.length) ?
			//в alertMsg записывается эта строка - тип данных + строка valuesArray
			`Данные с типом ${type}: ${valuesArray}` :
			//в alertMsg записывается эта строка, отсутствие данных
			`Отсутствуют данные типа ${type}`;
		// alertMsg передаётся в функцию showResults()
		showResults(alertMsg);
	} catch (e) {
		//если в блоке try произошла ошибка, то в функцию showError
		//бдет передана ошибка, содержащаяся в событии e 
		showError(`Ошибка: ${e}`);
	}
};
//находим html элемент button с id filter-btn
const filterButton = document.querySelector('#filter-btn');
//вешаем событие click на кнпку button с id filter-btn, по результатам click вызываем стрелочный коллбэк
filterButton.addEventListener('click', e => {
	//находим html элемент input с id=type (выбор типов данных)
	const typeInput = document.querySelector('#type');
	//находим html элемент input с id=data (ввод данных])
	const dataInput = document.querySelector('#data');
	//если введённые данные в dataInput = пустой строке, то
	if (dataInput.value === '') {
		// на dataInput вызывается функция-обработчик ошибки setCustomValidity (HTMLObjectElement) и
		// выводится всплывающий текст, который был передан в эту функцию
		dataInput.setCustomValidity('Поле не должно быть пустым!');
		//вызывается showResults
		showNoResults();
		//в ином случае
	} else {
		//вызывается функция setCustomValidity (HTMLObjectElement), это тоже обработчик ошибок
		//на .validity
		//при этом validity не контролируем, поэтому она не работает
		dataInput.setCustomValidity('');
		//отменяем стандартный обработчик на button
		e.preventDefault();
		// передаём в функцию tryFilterByType обработанные input методом trim()
		//trim() убирает лишние пробелы сначала и с конца строки
		//первый input - передаётся выбранный тип данных, второй - введённое значение
		tryFilterByType(typeInput.value.trim(), dataInput.value.trim());
	}
});