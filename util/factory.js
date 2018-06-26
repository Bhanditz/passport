module.exports = (uid, {name, totalNodes, upper, lower}) => {
    let nodes = [];

    if (totalNodes > 15)
        totalNodes = 15;

    if (totalNodes < 0)
        totalNodes = 0;

    for(let i = 0; i < totalNodes; i++)
        nodes.push(Math.floor((Math.random() * upper) + lower));
    return {name, uid, nodes};
};