import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Alert, Animated, Image } from 'react-native';

//importater l'image 
const logo = require('./src/images/personne.png');

const App = () => {
  const [ecranAccueil, setEcranAccueil] = useState(true);
  const [taches, setTaches] = useState([]);
  const [texteTache, setTexteTache] = useState('');

  //fonction pour naviguer vers l'écran des tâches
  const allerListe = () => {
    setEcranAccueil(false);
  };

  //fonction pour revenir à l'accueil
  const allerAccueil = () => {
    setEcranAccueil(true);
  };

  // fonction pour ajouter une nouvelle tâche
  const ajouterTache = () => {
    // vérifie que le texte de la tâche n'est pas vide
    if (texteTache.trim().length === 0) return;
    const nouvelleTache = { id: Date.now().toString(), texte: texteTache, statut: 'en cours' };
    // ajoute la nouvelle tâche à la liste des tâches
    setTaches([...taches, nouvelleTache]);
    // réinitialiser
    setTexteTache('');
  };

  //fonction pour changer le statut d'une tâche à savoir en cours et terminé
  const changerStatutTache = (idTache) => {
    setTaches(taches.map(tache =>
      tache.id === idTache ? { ...tache, statut: tache.statut === 'en cours' ? 'terminé' : 'en cours' } : tache
    ));
  };

  // fonction pour supprimer une tâche après confirmation
  const supprimerTache = (idTache) => {
    Alert.alert(
      'Supprimer la tâche',
      'Êtes-vous sûr de vouloir supprimer cette tâche ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          onPress: () => {
            setTaches(taches.filter(tache => tache.id !== idTache));
          }
        }
      ]
    );
  };

  // fonction pour rendre chaque élément de la liste des tâches
  const renderTache = ({ item }) => (
    <ItemTache
      tache={item}
      onToggle={() => changerStatutTache(item.id)}
      onDelete={() => supprimerTache(item.id)}
    />
  );

  return (
    <View style={styles.container}>
      {ecranAccueil ? (
        <EcranAccueil onNavigate={allerListe} />
      ) : (
        <EcranListe
          taches={taches}
          texteTache={texteTache}
          setTexteTache={setTexteTache}
          ajouterTache={ajouterTache}
          renderTache={renderTache}
          onNavigateHome={allerAccueil}
        />
      )}
      <PiedDePage />
    </View>
  );
};

//composant pour l'écran d'accueil
const EcranAccueil = ({ onNavigate }) => {
  return (
    <View style={styles.ecranAccueilContainer}>
      <Image source={logo} style={styles.logo} />
      <Text style={styles.bienvenueText}>Bienvenue dans TodoList</Text>
      <Text style={styles.instructionText}>
        Prenez le contrôle de vos tâches et planifiez avec soin.
        Une gestion minutieuse aujourd'hui vous mène vers un avenir plus organisé et productif.
      </Text>
      <TouchableOpacity style={styles.boutonDemarrer} onPress={onNavigate}>
        <Text style={styles.boutonDemarrerText}>Commencer</Text>
      </TouchableOpacity>
    </View>
  );
};

//Composant pour l'écran de liste des tâches
const EcranListe = ({ taches, texteTache, setTexteTache, ajouterTache, renderTache, onNavigateHome }) => {
  return (
    <View style={styles.ecranListeContainer}>
      <Text style={styles.titre}>To-do List</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ajouter une nouvelle tâche"
          placeholderTextColor="#888"
          value={texteTache}
          onChangeText={setTexteTache}
        />
        <TouchableOpacity style={styles.boutonAjouter} onPress={ajouterTache}>
          <Text style={styles.boutonAjouterText}>Ajouter</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={taches}
        keyExtractor={item => item.id}
        renderItem={renderTache}
      />
      <TouchableOpacity style={styles.boutonRetour} onPress={onNavigateHome}>
        <Text style={styles.boutonRetourText}>Retour</Text>
      </TouchableOpacity>
    </View>
  );
};

//Composant pour chaque élément de tâche
const ItemTache = ({ tache, onToggle, onDelete }) => {
  const [scale] = useState(new Animated.Value(1));

  //foonction pour gérer le clic sur une tâche
  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    onToggle();
  };

  return (
    <Animated.View style={[styles.itemTacheContainer, { transform: [{ scale }] }]}>
      <TouchableOpacity style={styles.itemTacheTexteContainer} onPress={handlePress}>
        <Text style={[styles.itemTacheTexte, tache.statut === 'terminé' && styles.itemTacheTermine]}>
          {tache.texte}
        </Text>
        <Text style={styles.itemTacheStatut}>{tache.statut}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onDelete}>
        <Text style={styles.boutonSupprimer}>✖</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Composant pour le footer avec animation
const PiedDePage = () => {
  const [translateY] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: 10,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [translateY]);

  return (
    <Animated.View style={[styles.piedDePage, { transform: [{ translateY }] }]}>
      <Text style={styles.piedDePageText}>Créé par Nouzouhati</Text>
    </Animated.View>
  );
};



//le style pour les différents composants
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  ecranAccueilContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
  },

  logo: {
    width: 300,
    height: 300,
    marginBottom: 32,
  },


  bienvenueText: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
  },

  instructionText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 32,
    color: '#555',
  },

  boutonDemarrer: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },

  boutonDemarrerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  ecranListeContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },

  boutonRetour: {
    position: 'absolute',
    top: 650,
    left: '50%',
    marginLeft: -40,
    backgroundColor: '#007bff',
    paddingVertical: 21,
    paddingHorizontal: 20,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  boutonRetourText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },


  titre: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#333',
  },


  inputContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },


  input: {
    flex: 1,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 25,
    padding: 12,
    backgroundColor: '#fff',
    marginRight: 12,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },


  boutonAjouter: {
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },


  boutonAjouterText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemTacheContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },


  itemTacheTexteContainer: {
    flex: 1,
  },

  itemTacheTexte: {
    fontSize: 18,
  },

  itemTacheStatut: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  itemTacheTermine: {
    textDecorationLine: 'line-through',
    color: '#aaa',
  },

  boutonSupprimer: {
    fontSize: 24,
    color: '#f44336',
  },
  piedDePage: {
    padding: 16,
    backgroundColor: '#007bff',
    alignItems: 'center',
    bottom: 0,
    position: 'absolute',
    width: '100%',
  },

  piedDePageText: {
    fontSize: 14,
    color: '#fff',
  },
});

export default App;
