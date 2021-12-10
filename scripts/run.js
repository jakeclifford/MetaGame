const main = async () => {
    const gameContractFactory = await hre.ethers.getContractFactory('NftGame')
    const gameContract = await gameContractFactory.deploy(
        ["Decentraland", "Somnium Space", "Crypto Voxels"],
        ["https://image.coinpedia.org/wp-content/uploads/2021/11/13121802/mana-and-decentraland-logo-1614900236158.webp",
        "https://s3.us-east-2.amazonaws.com/nomics-api/static/images/currencies/CUBE.png",
        "https://pbs.twimg.com/media/DkHPM0JU4AAemRj.jpg"],
        [200, 100, 125],
        [100, 125, 150],
        'Mark Zuckerburg',
        "https://media.wired.com/photos/617b2d027a3b2c1081c15704/master/w_2560%2Cc_limit/Business-Plaintext-Facebook-Meta-Connect-1.jpg",
        5000,
        25
    )
    await gameContract.deployed()
    console.log("contract deployed to:", gameContract.address)

    let txn;
    txn = await gameContract.mintCharacterNFT(2);
    await txn.wait();

    txn = await gameContract.attackZucks();
    await txn.wait();

    txn = await gameContract.attackZucks();
    await txn.wait();


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