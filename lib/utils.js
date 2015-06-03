var itemSize = 2
var box = { min: [0, 0], max: [0, 0] }

function bounds(positions) {
  var count = positions.length / itemSize
  box.min[0] = positions[0]
  box.min[1] = positions[1]
  box.max[0] = positions[0]
  box.max[1] = positions[1]

  for (var i=0; i<count; i++) {
    var x = positions[i * itemSize + 0]
    var y = positions[i * itemSize + 1]
    box.min[0] = Math.min(x, box.min[0])
    box.min[1] = Math.min(y, box.min[1])
    box.max[0] = Math.max(x, box.max[0])
    box.max[1] = Math.max(y, box.max[1])
  }
}

module.exports.computeBox = function(positions, output) {
  bounds(positions)
  output.min.set(box.min[0], box.min[1], 0) 
  output.max.set(box.max[0], box.max[1], 0)
}

module.exports.computeSphere = function(positions, output) {
  bounds(positions)
  var minX = box.min[0], minY = box.min[1],
      maxX = box.max[0], maxY = box.max[1],
      width = maxX - minX,
      height = maxY - minY,
      length = Math.sqrt(width*width + height*height)

  output.center.set(minX + width/2, minY + height/2, 0)
  output.radius = length/2
}
