module.exports = (uid, {name, totalNodes, upper, lower}) => {
    let nodes = [];
    for(let i = 0; i < totalNodes; i++)
        nodes.push(Math.floor((Math.random() * upper) + lower));
    return {name, uid, nodes};
};