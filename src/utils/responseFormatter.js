const handlerWrapperWithResponse = (handle) => async (req, res, next) => {
  try {
    const data = await handle(req, res, next);

    return res.json({
      message: 'Success',
      data,
    });
  } catch (e) {
    return next(e);
  }
};

const errorResponse = (message, statusCode = 500, errors = null) => {
  const response = {
    status: 'error',
    message,
    timestamp: new Date().toISOString()
  };

  if (errors) {
    response.errors = errors;
  }

  return response;
};

const paginationMeta = (page, pageSize, total) => {
  const totalPages = Math.ceil(total / pageSize);
  
  return {
    page,
    pageSize,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1
  };
};

module.exports = {
  handlerWrapperWithResponse,
  errorResponse,
  paginationMeta
};