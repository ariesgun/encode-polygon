pragma solidity ^0.8.0;
//SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyNFT is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {

  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  

  mapping(uint256  => address) public ownerByTokenId;

  mapping(address => uint256[]) public tokenIdsByOwner;


  constructor() payable ERC721("MyNFT", "MNFT") {
    // _setBaseURI("https://ipfs.io/ipfs/");
  }

  function mintItem(address to, string memory tokenURI)
      public
      onlyOwner
      returns (uint256)
  {

      uint256 id = _tokenIds.current();
      _safeMint(to, id);
      _setTokenURI(id, tokenURI);

      ownerByTokenId[id] = to;
      tokenIdsByOwner[to].push(id);

      _tokenIds.increment();

      return id;
  }

  // Mandatory functions to be inherited
  function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
  ) internal override(ERC721, ERC721Enumerable) {
      super._beforeTokenTransfer(from, to, tokenId);
  }

  function _burn(uint256 tokenId)
      internal
      override(ERC721, ERC721URIStorage)
  {
      super._burn(tokenId);
  }

  function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
  {
      return super.tokenURI(tokenId);
  }

  function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
  {
      return super.supportsInterface(interfaceId);
  }

}


