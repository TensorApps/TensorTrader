/* Passphrase popup - in beginning of a new session */
Vue.component('passphrase-popup', {
  template: `
<v-layout row justify-center v-if="popup">
  <v-dialog persistent max-width="290" v-model="popup">
    <v-card>
      <v-card-title class="headline"><v-icon>vpn_key</v-icon> Provide Passphrase</v-card-title>
      <v-card-text>
        <p>In order to use this application you need to provide a passphrase. It will be used for encrypting all sensitive user data.</p>
        <v-text-field label="User Passphrase" v-model="userPassphrase"></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-flex class="text-xs-center"><v-btn color="green" @click.native="popup = false" :disabled="!userPassphrase">OK</v-btn></v-flex>
      </v-card-actions>
    </v-card>
  </v-dialog>
</v-layout>`,

  data() {
    return {
      userPassphrase: '',
      popup: false
    };
  },

  created: function() {
    this.userPassphrase = this.$session.get('userPassphrase');
    this.popup = !this.userPassphrase;
  },

  watch: {
    userPassphrase: function() {
      if (this.userPassphrase) {
        this.$session.set('userPassphrase', this.userPassphrase);
      } else {
        this.$session.remove('userPassphrase');
      }
    }
  }
});
