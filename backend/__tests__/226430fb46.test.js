// ********RoostGPT********
/*
Test generated by RoostGPT for test NodeMochaTest using AI Type Open AI and AI Model gpt-4-1106-preview


ROOST_TEST_HASH=3dfdebf349

*/

// ********RoostGPT********
const jest = require('jest');
const express = require("express");
const router = express.Router();
const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
let registerValidation = require("../validation").registerValidation;
let loginValidation = require("../validation").loginValidation;

describe('/register endpoint', () => {
  let mockRequest, mockResponse, mockUser, mockBcrypt;
  
  beforeAll(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis()
    };
    mockUser = {
      findOne: jest.fn(),
      save: jest.fn()
    };
    mockBcrypt = {
      genSalt: jest.fn(),
      hash: jest.fn()
    };
    User.findOne = mockUser.findOne;
    User.prototype.save = mockUser.save;
    bcrypt.genSalt = mockBcrypt.genSalt;
    bcrypt.hash = mockBcrypt.hash;
  });

  beforeEach(() => {
    mockRequest.body = {
      name: "Test User",
      email: "test@example.com",
      password: "password123"
    };
    mockUser.findOne.mockReset();
    mockUser.save.mockReset();
    mockBcrypt.genSalt.mockReset();
    mockBcrypt.hash.mockReset();
    mockResponse.status.mockClear();
    mockResponse.send.mockClear();
    registerValidation = jest.fn();
    loginValidation = jest.fn();
  });

  test('should send 400 if validation fails', async () => {
    registerValidation.mockReturnValue({ error: { details: [{ message: "Invalid input" }] } });
    await router.post("/register", mockRequest, mockResponse);
    expect(registerValidation).toBeCalledWith(mockRequest.body);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.send).toHaveBeenCalledWith("Invalid input");
  });

  test('should send 400 if user already exists', async () => {
    mockUser.findOne.mockResolvedValue(true);
    await router.post("/register", mockRequest, mockResponse);
    expect(mockUser.findOne).toBeCalledWith({email: 'test@example.com'});
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.send).toHaveBeenCalledWith("user exist");
  });

  test('should hash password and save new user', async () => {
    mockUser.findOne.mockResolvedValue(false);
    mockBcrypt.genSalt.mockResolvedValue('salt');
    mockBcrypt.hash.mockResolvedValue('hashedPassword');
    await router.post("/register", mockRequest, mockResponse);
    expect(mockBcrypt.genSalt).toHaveBeenCalled();
    expect(mockBcrypt.hash).toHaveBeenCalledWith('password123', 'salt');
    expect(mockUser.save).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(200);
  });

  test('should send 400 if there is an error while saving the user', async () => {
    const errorMessage = "Error saving user";
    mockUser.findOne.mockResolvedValue(false);
    mockUser.save.mockRejectedValue(new Error(errorMessage));
    await router.post("/register", mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.send).toHaveBeenCalledWith(new Error(errorMessage));
  });
});

module.exports = router;
