import random
SUITS = { '♠' : "Spades",
          '♡' : "Hearts",
          '♢' : "Diamonds",
         '♣' : "Clubs"}

FAKENAMES = ["Bill(bot)", "Michaelangelo(bot)","Raphael(bot)","Donatello(bot)","Leonardo(bot)", "Critikal(bot)", "Goblin(bot)", "Cindy(bot)", "Binno(bot)", "Stickney(bot)", "LongNeck(bot)", "Gio(bot)", "RickFox(bot)" , "Ted(bot)", "Reckful(bot)", "Sodapoppin(bot)" , "MitchJones(bot)", "Tyler1(bot)", "Faker(bot)"]

class Deck:
    def __init__(self, cards = [], num_cards = 0):
        self.cards = cards
        self.num_cards = len(cards)

    def __repr__(self):
        return str(self.cards)
    
    def shuffle(self, shuff_type = "riffle"):
        #most common shuffle, done several times
        num_shuffles = random.randint(3,6)
        for i in range(0,num_shuffles):
            if shuff_type == "riffle":
                temp_cards = []
                half1 = self.cards[0:len(self.cards)//2]
                half2 = self.cards[len(self.cards)//2:]
                which_half = random.randint(0,1)
                
                if which_half == 1:
                    start_half = half1
                    other_half = half2
                else:
                    start_half = half2
                    other_half = half1
                    
                for i in range(0,len(self.cards)//2):
                    temp_cards.append(start_half[i])
                    temp_cards.append(other_half[i])
                self.cards = temp_cards
                
    def standard_deck(self):
        symbols = ["2","3","4","5","6","7","8","9","10","J","Q","K","A"]
        for symbol in symbols:
            for i in range(0,4):
                symbol_dict = { 0 : '♠',
                                1 : '♡',
                                2 : '♢',
                                3 : '♣'}
                temp = ""
                temp += symbol_dict[i] + symbol
                card = Card(symbol = temp)
                self.cards.append(card)
        return self.cards
        
class Card:
    def __init__(self, value= 0 , symbol = None):
        self.symbol = symbol
        if str(symbol).isnumeric():
            self.value = symbol
        else:
            self.value = 10
        
    def __repr__(self):
        out = ""
        out += f"[{self.symbol}]"
        if self.symbol[1:] != 10:
            out += "  "
        return out
    
    def get_suit(self):
        return SUITS[self.symbol]
    
class Table:
    def __init__(self, players, table_type = "BlackJack"):
        self.players = players
        self.table_type = table_type
    
    def make(self, shape = "Square"):
        #my attempts at ascii blackjack table
          if shape == "Square": 
            size = 30
            middle_offset = 2
            side_offset_top = 2
            card_offset_top = side_offset_top//2
            side_offset_bot = 12
            card_offset_bot = 12
            num_real_players = len(self.players)
            num_bot_players = 4 - num_real_players
            bot_dict = {"1" : "bot1", 
                        "2" : "bot2",
                        "3" : "bot3",
                        "4" : "bot4"}
            for i in range(num_bot_players):
                name = FAKENAMES[random.randint(0,len(FAKENAMES)-1)]
                bot_dict[i] = Player(name)

                self.players.append(bot_dict[i])    
                
            player1 = self.players[0]
            player2 = self.players[1]
            player3 = self.players[2]
            player4 = self.players[3]
            
          #  player2.clear_hand()
            print(player1)
            print(player2)
            print(player3)
            print(player4)

            for row in range(size):
                #top 2 names
                if row == size//2 +2:
                    print(f"*{' '*side_offset_top}{player1.name}  {' '*(size +size-(2*len(player2.name) + len(player1.name) + 2*side_offset_top)+len(player2.name)-2)}{player2.name}{' '*side_offset_top}*")
          
                #top players cards    block  -  -  -
                if row == size//2 +3:
                    num_tens = 1
                    player1_hand_str = ""
                    if player1.hand_size != 0:
                        for card in player1.hand:
                            if card.symbol[1:] == "10":
                                num_tens += 1
                            player1_hand_str += str(card)
                    player2_hand_str = ""
                    if player2.hand_size != 0:
                        for card in player2.hand:
                            if card.symbol[1:] == "10":
                                num_tens += 1
                            player2_hand_str += str(card)
                        
                        print(f"*{' '*card_offset_top}{player1_hand_str}  {' '*(size +size-9*(player2.hand_size + player1.hand_size + card_offset_top)-num_tens)}{player2_hand_str}{' '*card_offset_top}*")
                 # -  -  -
                 
                 
                 
                
                #bot 2 names
                if row == size/1.5 + 4:
                    print(f"*{' '*(side_offset_bot)}{player3.name}  {' '*(size +size-(2*len(player4.name) + len(player3.name) + 2*side_offset_bot)+len(player4.name)-2)}{player4.name}{' '*side_offset_bot}*")
                #bot players cards    block  -  -  -
                if row == size//1.5 +5:
                    num_tens = 1
                    player3_hand_str = ""
                    for card in player3.hand:
                        if card.symbol[1:] == "10":
                            num_tens += 1
                        player3_hand_str += str(card)
                    player4_hand_str = ""
                    for card in player4.hand:
                        if card.symbol[1:] == "10":
                            num_tens += 1
                        player4_hand_str += str(card)
                    
                    print(f"*{' '*card_offset_bot}{player3_hand_str}  {' '*(size + size -9*(player4.hand_size + player3.hand_size + card_offset_bot)-num_tens)}{player4_hand_str}{' '*card_offset_bot}*")
                 # -  -  -
                 
                 
                 
                if row == 0 or row == size - 1:
                    line = ""
                    for j in range(size - 1):
                        if j != size//2 - middle_offset:
                            line += "* "
                        elif row != size -1:
                            line +="Dealer "
                            
                        elif row == size -1:
                            line += "*    * "
                    print(line)
                else:
                    print("*" + " "*(size + size-1) + " *")

        
    
class Player:
    def __init__(self, name, money = 0, hand = []):
        self.name = name
        self.money = money
        self.hand = hand
        self.hand_size = len(self.hand)
    def __repr__(self):
        outstr = ""
        outstr += str(self.name) 
        outstr += str(self.hand) 
        outstr += str(self.money)
        return outstr
        
    def clear_hand(self):
        self.hand_size == 0
        self.hand = self.hand.clear()
print("begin execution")
deck1 = Deck()
deck1.standard_deck()
deck1.shuffle()

player1 = Player("Alex")
players = [player1]
player1.hand.append(deck1.cards.pop())
player1.hand.append(deck1.cards.pop())
table1 = Table(players)
table1.make()

deck1.shuffle()

print("end execution")
