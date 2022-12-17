export default [
    {
        name: 'environmentMapTexture',
        type: 'cubeTexture',
        path:
        [
            '/textures/environmentMaps/0/px.jpg',
            '/textures/environmentMaps/0/nx.jpg',
            '/textures/environmentMaps/0/py.jpg',
            '/textures/environmentMaps/0/ny.jpg',
            '/textures/environmentMaps/0/pz.jpg',
            '/textures/environmentMaps/0/nz.jpg'
        ]
    },
    {   /// Futuristic Normal Texture
        name: 'futuristicNormalTexture',
        type: 'texture',
        path: 'textures/interfaces/interfaceNormalMap.png'
    },
    {   /// Floor
        name: 'grassColorTexture',
        type: 'texture',
        path: 'textures/dirt/color.jpg'
    },
    {
        name: 'grassNormalTexture',
        type: 'texture',
        path: 'textures/dirt/normal.jpg'
    },
    {   /// Fox Model
        name: 'foxModel',
        type: 'gltfModel',
        path: 'models/Fox/glTF/Fox.gltf'
    },
    {   /// Head Model
        name: 'headColorTexture',
        type: 'texture',
        path: 'models/LeePerrySmith/color.jpg'
    },
    {
        name: 'headNormalTexture',
        type: 'texture',
        path: 'models/LeePerrySmith/normal.jpg'
    },
    {
        name: 'headModel',
        type: 'gltfModel',
        path: 'models/LeePerrySmith/LeePerrySmith.glb'
    },
    {   /// Helmet Model
        name: 'helmetAlbedoTexture',
        type: 'texture',
        path: 'models/DamagedHelmet/glTF/Default_albedo.jpg'
    },
    {
        name: 'helmetAOTexture',
        type: 'texture',
        path: 'models/DamagedHelmet/glTF/Default_AO.jpg'
    },
    {
        name: 'helmetEmissiveTexture',
        type: 'texture',
        path: 'models/DamagedHelmet/glTF/Default_emissive.jpg'
    },
    {
        name: 'helmetNormalTexture',
        type: 'texture',
        path: 'models/DamagedHelmet/glTF/Default_normal.jpg'
    },
    {
        name: 'helmetMetalRoughnesslTexture',
        type: 'texture',
        path: 'models/DamagedHelmet/glTF/Default_metalRoughness.jpg'
    },
    {
        name: 'helmetModel',
        type: 'gltfModel',
        path: 'models/DamagedHelmet/glTF/DamagedHelmet.gltf'
    },
]