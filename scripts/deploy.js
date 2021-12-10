const main = async () => {
    const gameContractFactory = await hre.ethers.getContractFactory('NftGame')
    const gameContract = await gameContractFactory.deploy(
        ["Decentraland", "Somnium Space", "Crypto Voxels"],
        ["QmYWKntdqPVoExxYPu3VDmUVeLqHoEmMnfe3rfAzJ3ZAUM",
        "QmPZJ7r13ne1rPrubyZzw4182DVN1HEuBxdZtZwyczM5Ku",
        "QmdouJZZVUintHcPxJZWDqt4NkbCqzqEhvNe1v8KGkfK7w"],
        [200, 100, 125],
        [100, 125, 150],
        'Mark Zuckerburg',
        "QmWFqDEYUa2rkivhL9wcdcdBJHw5Ln9cqYqCDZ45puRhJX",
        5000,
        25
    )
    await gameContract.deployed()
    console.log("contract deployed to:", gameContract.address)
}

const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };
  
runMain();