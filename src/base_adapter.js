var BaseAdapter = function() {};

BaseAdapter.prototype.filterExisting = function(files) {
    throw new Error('filterExisting not implemented on this adapter.');
};

module.exports = BaseAdapter;
