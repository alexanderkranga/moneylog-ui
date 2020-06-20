import aes256 from 'aes256';

export default class EncryptionService {
  encryptMoneyLog = (moneyLogEvent, passPhrase) => {
    const encryptedEvent = { ...moneyLogEvent };
    try {
      encryptedEvent.description = aes256.encrypt(
        passPhrase,
        encryptedEvent.description
      );
      encryptedEvent.amount = aes256.encrypt(
        passPhrase,
        encryptedEvent.amount + ''
      );
    } catch (error) {}

    return encryptedEvent;
  };

  decryptMoneyLog = (moneyLogEvent, passPhrase) => {
    const encryptedEvent = { ...moneyLogEvent };
    try {
      encryptedEvent.description = aes256.decrypt(
        passPhrase,
        encryptedEvent.description
      );
      encryptedEvent.amount = Number.parseFloat(
        aes256.decrypt(passPhrase, encryptedEvent.amount)
      );
    } catch (error) {}

    return encryptedEvent;
  };
}
