Vue.component('cart', {
    props: ['cartItems', 'img', 'visibility'],
    template: `
    <div class="cart-block" v-show="visibility">
        <cart-item v-for="item of cartItems" :img="img" :key="item.id_product" :cart-item="item"></cart-item>
    </div>
    `
});

Vue.component('cart-item', {
    props: ['img', 'cartItem'], //cartItem == cart-item
    template: `
            <div class="cart-item">
            <div class="cart-item__box">
                <img :src="img" class="cart-item__img" :alt="cartItem.product_name">
                <div class="cart-item__desc">
                    <div class="cart-item__title"> {{ cartItem.product_name}} </div>
                    <div class="cart-item__quantity">Quantity: {{ cartItem.quantity }}</div>
                    <div class="cart-item-single__price"> {{ cartItem.price}} $</div>
                </div>
            </div>
            <div class="cart-item__block">
                <button class="cart-item__remove btn-remove" @click="$root.remove(cartItem)">&times;</button>
                <div class="cart-item__price">
                    {{ cartItem.quantity * cartItem.price }} $
                </div>
            </div>
            </div>
    `
})