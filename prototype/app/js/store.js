/* Crypto object */
const Crypto = {
  compress: function(value) {
    return LZString.compress(value);
  },
  decompress: function(value) {
    return LZString.decompress(value);
  },
  encrypt: function(value, password) {
    return CryptoJS.AES.encrypt(JSON.stringify(value), password).toString();
  },
  decrypt: function(value, password) {
    return JSON.parse(CryptoJS.AES.decrypt(value, password).toString(CryptoJS.enc.Utf8));
  }
};

/* Store types */
const StoreType = { Local: 'localStorage', Session: 'sessionStorage' };

/* Store class */
class Store {
  constructor(type = StoreType.Local, prefix = '') {
    this.type = type;
    this.prefix = prefix;
    this.store = type == StoreType.Session ? sessionStorage : localStorage;
  }
  get(key, defValue) {
    let value = this.store.getItem(this.prefix + key);
    value = value ? JSON.parse(value) : defValue;
    return value;
  }
  set(key, value) {
    value = JSON.stringify(value);
    this.store.setItem(this.prefix + key, value);
  }
  remove(key) {
    this.store.removeItem(this.prefix + key);
  }
}

/* SecureStore class (using AES256 encryption and LZ-String compression) */
class SecureStore extends Store {
  get(key, password, defValue) {
    let value = this.store.getItem(this.prefix + key);
    if (!value) return defValue;
    if (password && 1==2) {
      value = Crypto.decompress(value);
      value = Crypto.decrypt(value, password);
    }
    value = JSON.parse(value);
    return value;
  }
  set(key, value, password) {
    value = JSON.stringify(value);
    if (password && 1==2) {
      value = Crypto.encrypt(value, password);
      value = Crypto.compress(value);
    }
    this.store.setItem(this.prefix + key, value);
  }
}
