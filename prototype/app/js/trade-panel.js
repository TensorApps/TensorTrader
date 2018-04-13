/* Trade panel */
Vue.component('trade-panel', {
  template: `
<v-layout row wrap>
  <v-flex xs12>
    <v-tabs color="transparent" grow>
      <v-tab active-class="default-class selected-tab">
        <h3>LIMIT</h3>
      </v-tab>
      <v-tab active-class="default-class selected-tab">
        <h3>MARKET</h3>
      </v-tab>
      <v-tab active-class="default-class selected-tab">
        <h3>STOP</h3>
      </v-tab>
      <v-tab-item>
        <v-card>
          <v-card-text>
            <v-container fluid grid-list-xs>
              <v-layout row wrap>
                <v-flex xs6>
                  <v-text-field id="amount" label="AMOUNT" suffix="BTC" v-model="amount"></v-text-field>
                </v-flex>
                <v-flex xs6>
                  <v-text-field id="price" label="PRICE" suffix="USD" v-model="price"></v-text-field>
                </v-flex>
                <v-flex xs6>
                  <v-btn color="success" large block>BUY</v-btn>
                </v-flex>
                <v-flex xs6>
                  <v-btn color="error" large block>SELL</v-btn>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card>
          <v-card-text>Not implemented yet. Who is doing Market orders anyway? ;)</v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card>
          <v-card-text>Not implemented yet. Stop Orders are good, though! ;)</v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-flex>
</v-layout>`,
  data() {
    return {
      exchange: {},
      market: {},
      amount: '0.00000000',
      price: '0.00'
    };
  }
});
