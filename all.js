import zh_TW from './zh_TW.js';

VeeValidate.configure({
  classes: {
    valid: 'is-valid',
    invalid: 'is-invalid',
  },
});

VeeValidate.localize('tw', zh_TW);

Vue.use(VueLoading);
Vue.component('loading', VueLoading);
Vue.component('ValidationProvider', VeeValidate.ValidationProvider);
Vue.component('ValidationObserver', VeeValidate.ValidationObserver);



new Vue({
  el: '#app',
  data: {
    test: 'test',
    user: {
      token: '',
      uuid: 'c53785a2-76f4-4643-8cf6-c844e63fff94'
    },
    url: 'https://course-ec-api.hexschool.io/api/',
    products: [],
    isLoading: false,
    tempProduct: {
      num: 0
    },
    status: {
      loadingItem: '',
    },
    cart: [],
    form: {
      name: '',
      email: '',
      tel: '',
      address: '',
      payment: '',
      message: '',
    },
  },

  methods: {
    clientGetProduct(){
      const api = `${this.url}${this.user.uuid}/ec/products`;
      
      this.isLoading = true;

      axios.get(api)
        .then((res) => {

          this.products = res.data.data;
          this.isLoading = false;

        })
        .catch((err) => {
          console.log('error: ', error);
        })
    },

    getCartList(page = 1){

      const api = `${this.url}${this.user.uuid}/ec/shopping?${page}`;

      axios.get(api)
      .then((res) => {

        this.cart = res.data.data;

      })
      .catch((err) => {
        console.log(err);
      })

    },

    getProductDetail(itemId){

      this.status.loadingItem = itemId;
      const api = `${this.url}${this.user.uuid}/ec/product/${itemId}`

      axios.get(api)
        .then((res) => {

          this.tempProduct = res.data.data;
          $('#productModal').modal('show');
          this.status.loadingItem = '';

        })
        .catch((err) => {
          console.log(err);
        })
    },

    addToCart(item, quantity = 1){
      const api = `${this.url}${this.user.uuid}/ec/shopping`;

      const cart = {
        product: item.id,
        quantity,
      };

      axios.post(api, cart).then(() => {
        this.status.loadingItem = '',
        $('#productModal').modal('hide');
        this.getCartList();

      }).catch((err) => {
        console.log(err);
        this.status.loadingItem = '',
        $('#productModal').modal('hide');
      })

    },

    quantityUpdata(id, num){
      this.isLoading = true;
      const api = `${this.url}${this.user.uuid}/ec/shopping`;

      const data = {
        product: id,
        quantity: num
      };

      axios.patch(api, data)
      .then(() => {
        this.isLoading = false;
        this.getCartList();
      }).catch((err) => {
        console.log(err);
      })

    },

    deleteAllInCart(){

      this.isLoading = true;
      const api = `${this.url}${this.user.uuid}/ec/shopping/all/product`;

      axios.delete(api)
      .then(() => {
        this.getCartList();
        this.isLoading = false;
      }).catch((err) => {
        console.log(err);
      })
    },

    deleteSingleInCart(id){

      this.isLoading = true;
      const api = `${this.url}${this.user.uuid}/ec/shopping/${id}`;

      axios.delete(api)
      .then(() => {
        this.getCartList();
        this.isLoading = false;
      }).catch(() => {
        console.log(err);
      })
    },

    submitForm(){
      this.isLoading = true;
      const api = `${this.url}${this.user.uuid}/ec/orders`;

      axios.post(api, this.form)
      .then(() => {
        this.isLoading = false;
        $('#orderModal').modal('show');
        this.getCartList();
      }).catch((err) => {
        console.log(err);
      })
    }
  },

  created() {
    this.getCartList();
    this.clientGetProduct();
  },
})