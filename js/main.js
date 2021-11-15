const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

const app = new Vue({ //обект класса VUe
    el: '#app', //синхранизая с версткой 
    data: { //глобальные свойства
        userSearch: '', //отвичает за фильтр
        showCart: false, //отвечает за показ корзины
        catalogUrl: '/catalogData.json', //файл содержащий товары каталога
        carturl: '/getBasket.json', //файл содержащий каталог корзина товаров
        products: [], //масив продуктов
        filtered: [], //масив товаров с учетом фильтра 
        cartItems: [], //массив товаров в корзине
        imgProduct: 'https://via.placeholder.com/200x150',
        imgCart: 'https://via.placeholder.com/50x100',
        error: false
    }, //после создание обектов переходим в методы
    methods: {

        filter() {
            let regexp = new RegExp(this.userSearch, 'i'); //рег выражение на то что мы введем в инпуте search
            this.filtered = this.filtered.filter(el => regexp.test(el.product_name)); // к массиву применям метод filter и ищем товары соответвующие рег выражению. Получаем массив отфильтрованных товаров 
        },
        getJson(url) { //для считывания товаров с внешнихъ фалов
            return fetch(url) // с помощью  fetch мы конектимся к url и затем вызываем then
                .then(result => result.json()) //строка json преобразуется в обект
                .catch(error => console.log(error)) //this.error = true 
        },
        addProduct(item) {
            this.getJson(`${API}/addToBasket.json`) //проверям роль если 1 то можно добавлять 
                .then(data => {
                    if (data.result === 1) {
                        let find = this.cartItems.find(el => el.id_product === item.id_product); //провермя был ли товар в корзине, применям метод find он возврашает первый найденый элемент, если айдишник совпадает увеличиваем кол-во
                        if (find) {
                            find.quantity++;
                        } else { // если товара не было то создаем товар корзины
                            const prod = Object.assign({ //assign копирует из исходных объектов в целевой объект, соединяме два обекта в один
                                quantity: 1
                            }, item);
                            this.cartItems.push(prod)
                        }
                    }
                })
        },
        remove(item) {
            this.getJson(`${API}/addToBasket.json`) //проверям роль если 1 то можно добавлять 
                .then(data => {
                    if (data.result === 1) {
                        if (item.quantity > 1) {
                            item.quantity--;
                        } else {
                            this.cartItems.splice(this.cartItems.indexOf(item), 1) //находим индекс с которого нужно удалить товар
                        }
                    }
                })
        }


    },
    mounted() { //mounted запускается в первую очередь и тут мы добавляем в наши массивы товары
        this.getJson(`${API + this.carturl}`) //парсим json файлик для корзины
            .then(data => { //так как json из метода getJson возвращает промис то сново пишем then, data это преобразованный из json обект
                for (let item of data.contents) { //обходим моссив товаров из contents
                    this.cartItems.push(item);
                }
            })
        this.getJson(`${API + this.catalogUrl}`) //парсим файлик товаров каталога
            .then(data => {
                for (let item of data) { //зполняем оба массива одинаковыми товарами 
                    //обращение к массивам из data(глобальные свойства)
                    this.$data.products.push(item); //этот массив будет не изменный 
                    this.$data.filtered.push(item); // когда мы будем вводить что то в фильтр мы будем уменьшать массив. Будет рег выражение. Он будет изменяться
                } // $data можно не писать, это сделано для того что бы если мы переоределеям массивы 
            });

        this.getJson(`getProducts.json`) //тут мы парсим локальный файл, если е работаем с сервером
            .then(data => {
                for (let item of data) {
                    this.products.push(item);
                    this.filtered.push(item);
                }
            })
    }

});