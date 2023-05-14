import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore


cred = credentials.Certificate("fire_key.json")
firebase_admin.initialize_app(cred)

db=firestore.client()


from scipy import spatial  

def find_recommended_link(category, user_id):
    user_ref = db.collection(u'userRatings').document(f'{user_id}')
    user = user_ref.get().to_dict()
   
    max_value =  max(user[f'{category}_ratings'])

    unviewed_links_index = []
    for count, i in enumerate(user[f'{category}_ratings']):
        if i == max_value:
            index = count
        if i != 0:
            pass
        else: 
            unviewed_links_index.append(count)
 
    links_ref = db.collection(u'links').document(f'{category}_links')
    links = links_ref.get().to_dict()
    
    links = [(a,b) for a,b in links_ref.get().to_dict().items()]
    favorite_link = [(a,b) for a,b in links if a.endswith(str(index))][0]
    favorite_link_vector = favorite_link[1][:2] + [-1]

    
    unviewed_links = []

    for i in unviewed_links_index:
        for l in links:
            if l[0].endswith(str(i)):
                unviewed_links.append(l)
    
   
    highest_similarity_link_similarity = 0
    
    for i in unviewed_links:
        unviewed_link_vector = i[1][:2] + [-1]
        similarity = 1 - spatial.distance.cosine(unviewed_link_vector, favorite_link_vector)
        
        if similarity > highest_similarity_link_similarity:
            highest_similarity_link = i
            highest_similarity_link_similarity = similarity
    
    unviewed_links = [i[1][2] for i in unviewed_links]
    
    return (highest_similarity_link[1][2], unviewed_links)