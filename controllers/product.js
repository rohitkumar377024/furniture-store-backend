const findAll = async (req, res) => {
  res.send('List of Products - READ');
};

const findOne = async (req, res) => {
  res.send('One Product - READ');
};

const create = async (req, res) => {
  res.send('Create Product - CREATE');
};

const updateOne = async (req, res) => {
  res.send('Update Product - UPDATE');
};

const deleteOne = async (req, res) => {
  res.send('Delete Product - DELETE');
};

module.exports = {
  findAll,
  findOne,
  create,
  updateOne,
  deleteOne
};
