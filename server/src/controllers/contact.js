let Contact = require('../models/contact'),
  config = require('../common/config'),
  utils = require('../common/utils'),
  bcrypt = require('bcrypt');

let controller = {};

controller.createContact = (userId, firstName, lastName) => {
  return new Promise((resolve, reject) => {
    let contact = new Contact();
    contact.userId = userId;
    contact.firstName = firstName;
    contact.lastName = lastName;
    saveContact(contact, resolve, reject);
  });
};

controller.getContactByUserId = (userId) => {
  return new Promise((resolve, reject) => {
    Contact.findOne({userId: userId}, (err, contact) => {
      utils.handleErrorIfAny(err, contact, reject);
      resolve(contact);
    });
  });
};

controller.getContactById = (id) => {
  return new Promise((resolve, reject) => {
    Contact.findById(id, (err, contact) => {
      utils.handleErrorIfAny(err, contact, reject);
      resolve(contact);
    });
  });
};

controller.updateContact = (toBeUpdatedContact) => {
  return new Promise((resolve, reject) => {
    Contact.findOne({userId: toBeUpdatedContact.userId}, (err, contact) => {
      utils.handleErrorIfAny(err, contact, reject);
      contact.firstName = toBeUpdatedContact.firstName;
      contact.lastName = toBeUpdatedContact.lastName;
      contact.avatarUrl = toBeUpdatedContact.avatarUrl;
      saveContact(contact, resolve, reject);
    });
  });
};

let saveContact = (contact, resolve, reject) => {
  contact.save((err, saved) => {
    utils.handleErrorIfAny(err, saved, reject);
    resolve(saved);
  });
};

module.exports = controller;