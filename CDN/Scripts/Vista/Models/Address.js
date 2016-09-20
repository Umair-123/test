
Vista.Models.Address = function () {
    ///<summary>An address object returned by the address search.</summary>
    'use strict';

    this.street = '';
    this.city = '';
    this.state = '';
    this.postcode = '';
    this.suburb = '';
};

Vista.Models.Address.prototype.parse = function (address) {
    ///<param name="address">Address serialized down from server. This maps to the DataContracts.Address class.</param>
    'use strict';

    this.street = Vista.Utilities.joinWithoutEmpty(', ', address.Address1, address.Address2);
    this.suburb = address.Suburb;
    this.city = address.City;
    this.state = address.State;
    this.postcode = address.ZipCode;
};

    