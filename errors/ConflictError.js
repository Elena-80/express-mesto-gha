class ConflictError extends Error {
  constructor(message = 'Конфликт') {
    super(message);
    this.statusCode = 409;
  }
}

module.exports = ConflictError;
