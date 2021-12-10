// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "hardhat/console.sol";

import "./libraries/Base64.sol";

contract NftGame is ERC721 {
  
  struct CharacterAttributes {
    uint characterIndex;
    string name;
    string imageURI;
    uint hp;
    uint maxHp;
    uint attackDamage;
  }

  struct MZucks {
      string name;
      string imageURI;
      uint hp;
      uint maxHp;
      uint attackDamage;
  }

   MZucks public mZucks;

  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;
  
  CharacterAttributes[] defaultCharacters;

  mapping(uint256 => CharacterAttributes) public nftHolderAttributes;

  mapping(address => uint256) public nftHolders;

  event CharacterNFTMinted(address sender, uint256 tokenId, uint256 characterIndex);
  event AttackComplete(uint newBossHp, uint newPlayerHp);
  
  constructor(
    string[] memory characterNames,
    string[] memory characterImageURIs,
    uint[] memory characterHp,
    uint[] memory characterAttackDmg,
    string memory bossName,
    string memory bossImageURI,
    uint bossHp,
    uint bossAttackDamage

    ) 
      ERC721("MetaverseBattle", "METABATTLE")
    {

    mZucks = MZucks({
      name: bossName,
      imageURI: bossImageURI,
      hp: bossHp,
      maxHp: bossHp,
      attackDamage: bossAttackDamage
    });  

     console.log("Done initializing boss %s w/ HP %s, img %s", mZucks.name, mZucks.hp, mZucks.imageURI);

      for(uint i = 0; i < characterNames.length; i++){
        defaultCharacters.push(CharacterAttributes({
          characterIndex: i,
          name: characterNames[i],
          imageURI: characterImageURIs[i],
          hp: characterHp[i],
          maxHp: characterHp[i],
          attackDamage: characterAttackDmg[i]
        }));

      CharacterAttributes memory c = defaultCharacters[i];
      console.log("Done intialising %s w/ HP %s, img %s", c.name, c.hp, c.imageURI);
        
      }
      _tokenIds.increment();
  }

  function mintCharacterNFT(uint _characterIndex) external {
    uint256 newItemId = _tokenIds.current();
    _safeMint(msg.sender, newItemId);

    nftHolderAttributes[newItemId] = CharacterAttributes({
      characterIndex: _characterIndex,
      name: defaultCharacters[_characterIndex].name,
      imageURI: defaultCharacters[_characterIndex].imageURI,
      hp: defaultCharacters[_characterIndex].hp,
      maxHp: defaultCharacters[_characterIndex].maxHp,
      attackDamage: defaultCharacters[_characterIndex].attackDamage
    });

    console.log("Minted NFT w/ tokenId %s and characterIndex %s", newItemId, _characterIndex);
  
    nftHolders[msg.sender] = newItemId;

    _tokenIds.increment();
    emit CharacterNFTMinted(msg.sender, newItemId, _characterIndex);
  }

  function tokenURI(uint256 _tokenId) public view override returns (string memory) {
    CharacterAttributes memory charAttributes = nftHolderAttributes[_tokenId];

    string memory strHp = Strings.toString(charAttributes.hp);
    string memory strMaxHp = Strings.toString(charAttributes.maxHp);
    string memory strAttackDamage = Strings.toString(charAttributes.attackDamage);

    string memory json = Base64.encode(
      bytes(
        string(
          abi.encodePacked(
            '{"name": "',
            charAttributes.name,
            ' -- NFt #: ',
            Strings.toString(_tokenId),
            '", "description": "This is an NFT that lets people play in the game Meta Slayer!", "image": "ipfs://',
            charAttributes.imageURI,
            '", "attributes": [ { "trait_type": "Health Points", "value": ',strHp,', "max_value":',strMaxHp,'}, { "trait_type": "Attack Damage", "value": ',
            strAttackDamage,'} ]}'
          )
        )
      )
    );

    string memory output = string(
      abi.encodePacked("data:application/json;base64,", json)
    );

    return output;
  }

  function attackZucks() public {
    uint nftTokenIdOfPlayer = nftHolders[msg.sender];
    CharacterAttributes storage player = nftHolderAttributes[nftTokenIdOfPlayer];
    console.log("\nPlayer w/ character %s about to attack. Has %s HP and %s AD", player.name, player.hp, player.attackDamage);
    console.log("Zucks %s has %s HP and %s AD", mZucks.name, mZucks.hp, mZucks.attackDamage);
  
    require (
      player.hp > 0,
      "Error: character must have HP to attack boss."
    );

    require (
      mZucks.hp > 0,
      "Error: Zucks must have HP to be attacked."
    );

    if (mZucks.hp < player.attackDamage) {
      mZucks.hp = 0;
    } else {
      mZucks.hp = mZucks.hp - player.attackDamage;
    }

    if (player.hp < mZucks.attackDamage) {
      player.hp = 0;
    } else {
      player.hp = player.hp - mZucks.attackDamage;
    }
  
    console.log("Player attacked Zucks. New Zucks hp: %s", mZucks.hp);
    console.log("Boss attacked player. New player hp: %s\n", player.hp);

    emit AttackComplete(mZucks.hp, player.hp);
  }

  function checkIfUserHasNFT() public view returns (CharacterAttributes memory) {

    uint256 userNftTokenId = nftHolders[msg.sender];

    if (userNftTokenId > 0) {
      return nftHolderAttributes[userNftTokenId];
    } else {
      CharacterAttributes memory emptyStruct;
      return emptyStruct;
    }
  }

  function getAllDefaultCharacters() public view returns (CharacterAttributes[] memory) {
    return defaultCharacters;
  }

  function getMZucks() public view returns (MZucks memory) {
    return mZucks;
  }
}