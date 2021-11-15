const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

const app = new Vue({
    el: '#app',
    data: {
        userSearch: '',
        showCart: false,
        catalogUrl: '/catalogData.json',
        carturl: '/getBasket.json',
        products: [],
        filtered: [],
        cartItems: [],
        imgCatalog: 'https://via.placeholder.com/200x150',
    },
    methods: {

        filter() {
            let regexp = new RegExp(this.userSearch, 'i');
            this.filtered = this.filtered.filter(el => regexp.test(el.product_name));
        },
        getJson(url) {
            return fetch(url)
                .then(result => result.json())
                .catch(error => console.log(error))
        },
        addProduct(item) {
            this.getJson(`${API}/addToBasket.json`)
                .then(data => {
                    if (data.result === 1) {
                        let find = this.cartItems.find(el => el.id_product === item.id_product);
                        if (find) {
                            find.quantity++;
                        } else {
                            const prod = Object.assign({ //assign копирует из исходных объектов в целевой объект
                                quantity: 1
                            }, item);
                            this.cartItems.push(prod)
                        }
                    }
                })
        },
        removeFromCart(item) {
            let index = this.cartItems.indexOf(item.id_product);

            if (item.quantity > 1) {
                item.quantity--;
            } else {
                this.cartItems.splice(index, 1);
            }

        }

    },
    mounted() {
        this.getJson(`${API + this.carturl}`)
            .then(data => {
                for (let item of data.contents) {
                    this.cartItems.push(item);
                }
            })
        this.getJson(`${API + this.catalogUrl}`)
            .then(data => {
                for (let item of data) {
                    this.$data.products.push(item);
                    this.$data.filtered.push(item);
                }
            });


        this.getJson(`getProducts.json`)
            .then(data => {
                for (let item of data) {
                    this.products.push(item);
                    this.filtered.push(item);
                }
            })
    }

});