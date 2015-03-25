TextElement = function(id, text, properties)
{
    this.id = id;
    this.text = text;
    this.properties = properties;
};

TextElement.prototype.updateValues = function(text, properties)
{
    this.text = text;
    this.properties = properties;
};